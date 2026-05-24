import { Injectable } from '@nestjs/common';
import { CarModel, ICar } from '../models/car.model';
import * as mongoose from 'mongoose';

@Injectable()
export class CarRepository {
  // Safe in-memory store fallback when local MongoDB is offline
  private static inMemoryStore: any[] = [];

  private isDbConnected(): boolean {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  private computeInMemoryValueScore(car: any): number {
    const currentYear = new Date().getFullYear();
    const age = Math.max(1, currentYear - car.year);
    
    // UAE Average mileage expected is ~20,000 km per year
    const expectedMileage = age * 20000;
    const mileageRatio = expectedMileage / Math.max(5000, car.mileage);
    const efficiencyScore = Math.min(100, Math.round(mileageRatio * 50));

    // Compute weighted sum
    const calculatedScore = Math.round(
      car.priceScore * 0.35 +
      car.trustScore * 0.25 +
      car.demandScore * 0.15 +
      car.conditionScore * 0.15 +
      efficiencyScore * 0.10
    );

    return Math.min(100, Math.max(0, calculatedScore));
  }

  private matchesFilters(car: any, filters: any): boolean {
    for (const key of Object.keys(filters)) {
      if (key === '$or') {
        const orConditions = filters.$or;
        const matchAny = orConditions.some((cond: any) => this.matchesFilters(car, cond));
        if (!matchAny) return false;
        continue;
      }

      const value = car[key];
      const filterVal = filters[key];

      if (filterVal && typeof filterVal === 'object') {
        if (filterVal.$regex) {
          const regex = new RegExp(filterVal.$regex, filterVal.$options || 'i');
          if (typeof value === 'string') {
            if (!regex.test(value)) return false;
          } else {
            return false;
          }
        }
        if (filterVal.$gte !== undefined && value < filterVal.$gte) return false;
        if (filterVal.$lte !== undefined && value > filterVal.$lte) return false;
      } else {
        if (typeof value === 'string' && typeof filterVal === 'string') {
          if (value.toLowerCase() !== filterVal.toLowerCase()) return false;
        } else {
          if (value !== filterVal) return false;
        }
      }
    }
    return true;
  }

  async create(carData: Partial<ICar>): Promise<ICar> {
    if (this.isDbConnected()) {
      const newCar = new CarModel(carData);
      return await newCar.save();
    }

    // In-memory fallback
    const id = new mongoose.Types.ObjectId().toHexString();
    const newCar = {
      _id: id,
      ...carData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    newCar.valueScore = this.computeInMemoryValueScore(newCar);
    CarRepository.inMemoryStore.push(newCar);
    return newCar;
  }

  async findAll(
    filters: Record<string, any>,
    pagination: { page: number; limit: number }
  ): Promise<{ cars: ICar[]; total: number }> {
    const page = Math.max(1, pagination.page);
    
    // Strict Performance Rules: Cap limit to 50 max
    let limit = Math.max(1, pagination.limit);
    if (limit > 50) {
      limit = 50;
    }
    const skip = (page - 1) * limit;

    if (this.isDbConnected()) {
      // Use projections to keep responses thin (avoid over-the-wire overhead)
      const [cars, total] = await Promise.all([
        CarModel.find(filters)
          .sort({ valueScore: -1, price: 1 }) // Default sort strictly by rank
          .skip(skip)
          .limit(limit)
          .select('-__v -createdAt -updatedAt') // Exclude unneeded fields
          .exec(),
        CarModel.countDocuments(filters).exec(),
      ]);
      return { cars, total };
    }

    // In-memory fallback
    const filteredCars = CarRepository.inMemoryStore.filter((car) =>
      this.matchesFilters(car, filters)
    );

    // Sort by valueScore desc, price asc (Competitiveness ranking index behavior)
    filteredCars.sort((a, b) => {
      if (b.valueScore !== a.valueScore) {
        return b.valueScore - a.valueScore;
      }
      return a.price - b.price;
    });

    const paginatedCars = filteredCars.slice(skip, skip + limit).map((car) => {
      const { __v, createdAt, updatedAt, ...cleanCar } = car;
      return cleanCar;
    });

    return {
      cars: paginatedCars,
      total: filteredCars.length,
    };
  }

  async findById(id: string): Promise<ICar | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    if (this.isDbConnected()) {
      return await CarModel.findById(id).select('-__v').exec();
    }

    // In-memory fallback
    const car = CarRepository.inMemoryStore.find((c) => c._id === id);
    if (!car) return null;

    const { __v, ...cleanCar } = car;
    return cleanCar;
  }

  async update(id: string, updateData: Partial<ICar>): Promise<ICar | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    if (this.isDbConnected()) {
      const carInstance = await CarModel.findById(id);
      if (!carInstance) {
        return null;
      }
      Object.assign(carInstance, updateData);
      return await carInstance.save();
    }

    // In-memory fallback
    const index = CarRepository.inMemoryStore.findIndex((c) => c._id === id);
    if (index === -1) return null;

    const existingCar = CarRepository.inMemoryStore[index];
    const updatedCar = {
      ...existingCar,
      ...updateData,
      updatedAt: new Date(),
    };

    updatedCar.valueScore = this.computeInMemoryValueScore(updatedCar);
    CarRepository.inMemoryStore[index] = updatedCar;
    return updatedCar;
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }

    if (this.isDbConnected()) {
      const result = await CarModel.deleteOne({ _id: id }).exec();
      return result.deletedCount > 0;
    }

    // In-memory fallback
    const initialLength = CarRepository.inMemoryStore.length;
    CarRepository.inMemoryStore = CarRepository.inMemoryStore.filter((c) => c._id !== id);
    return CarRepository.inMemoryStore.length < initialLength;
  }

  async getBestDeals(limitCap: number): Promise<ICar[]> {
    const limit = Math.min(50, Math.max(1, limitCap));

    if (this.isDbConnected()) {
      // Return high-value ranked items using projections
      return await CarModel.find()
        .sort({ valueScore: -1, price: 1 })
        .limit(limit)
        .select('-__v -createdAt -updatedAt')
        .exec();
    }

    // In-memory fallback
    const sorted = [...CarRepository.inMemoryStore].sort((a, b) => {
      if (b.valueScore !== a.valueScore) {
        return b.valueScore - a.valueScore;
      }
      return a.price - b.price;
    });

    return sorted.slice(0, limit).map((car) => {
      const { __v, createdAt, updatedAt, ...cleanCar } = car;
      return cleanCar;
    });
  }
}

