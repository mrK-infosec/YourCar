import { Injectable, NotFoundException } from '@nestjs/common';
import { CarRepository } from '../repositories/car.repository';
import { CacheService } from './cache.service';
import { ICar } from '../models/car.model';

@Injectable()
export class CarService {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly cacheService: CacheService
  ) {}

  async create(carData: any): Promise<ICar> {
    const car = await this.carRepository.create(carData);
    // Invalidate best deals cache
    await this.cacheService.delete('best_deals_10');
    return car;
  }

  async findAll(
    queryParams: Record<string, any>
  ): Promise<{ cars: ICar[]; total: number; page: number; limit: number }> {
    const page = parseInt(queryParams.page || '1', 10);
    const limit = parseInt(queryParams.limit || '10', 10);
    
    // Parse filters safely to prevent SQL/NoSQL injection (mongoSanitize runs globally in main.ts anyway)
    const filters: Record<string, any> = {};

    if (queryParams.brand) {
      filters.brand = { $regex: queryParams.brand, $options: 'i' };
    }
    if (queryParams.model) {
      filters.model = { $regex: queryParams.model, $options: 'i' };
    }
    if (queryParams.location) {
      filters.location = { $regex: queryParams.location, $options: 'i' };
    }
    
    // Ranges
    if (queryParams.minPrice || queryParams.maxPrice) {
      filters.price = {};
      if (queryParams.minPrice) filters.price.$gte = parseFloat(queryParams.minPrice);
      if (queryParams.maxPrice) filters.price.$lte = parseFloat(queryParams.maxPrice);
    }
    if (queryParams.minYear || queryParams.maxYear) {
      filters.year = {};
      if (queryParams.minYear) filters.year.$gte = parseInt(queryParams.minYear, 10);
      if (queryParams.maxYear) filters.year.$lte = parseInt(queryParams.maxYear, 10);
    }
    if (queryParams.maxMileage) {
      filters.mileage = { $lte: parseFloat(queryParams.maxMileage) };
    }

    // TYPO TOLERANCE & KEYWORD SEARCH (v1 Engine)
    if (queryParams.search) {
      const keyword = queryParams.search.trim();
      filters.$or = [
        { brand: { $regex: keyword, $options: 'i' } },
        { model: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ];
    }

    const { cars, total } = await this.carRepository.findAll(filters, { page, limit });
    
    return {
      cars,
      total,
      page,
      limit: Math.min(50, limit),
    };
  }

  async findOne(id: string): Promise<ICar> {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new NotFoundException(`Car with ID ${id} was not found`);
    }
    return car;
  }

  async update(id: string, updateData: any): Promise<ICar> {
    const updatedCar = await this.carRepository.update(id, updateData);
    if (!updatedCar) {
      throw new NotFoundException(`Car with ID ${id} was not found`);
    }
    // Invalidate best deals cache
    await this.cacheService.delete('best_deals_10');
    return updatedCar;
  }

  async remove(id: string): Promise<void> {
    const success = await this.carRepository.delete(id);
    if (!success) {
      throw new NotFoundException(`Car with ID ${id} was not found`);
    }
    // Invalidate best deals cache
    await this.cacheService.delete('best_deals_10');
  }

  async getBestDeals(limit = 10): Promise<ICar[]> {
    const cacheKey = `best_deals_${limit}`;
    
    // Check Cache-aside
    const cachedDeals = await this.cacheService.get<ICar[]>(cacheKey);
    if (cachedDeals) {
      return cachedDeals;
    }

    // Cache miss, query repository
    const deals = await this.carRepository.getBestDeals(limit);
    
    // Cache for 10 seconds to limit DB load on high-traffic deals page
    await this.cacheService.set(cacheKey, deals, 10);
    
    return deals;
  }
}
