"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var CarRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRepository = void 0;
const common_1 = require("@nestjs/common");
const car_model_1 = require("../models/car.model");
const mongoose = __importStar(require("mongoose"));
let CarRepository = class CarRepository {
    static { CarRepository_1 = this; }
    static inMemoryStore = [];
    isDbConnected() {
        return mongoose.connection && mongoose.connection.readyState === 1;
    }
    computeInMemoryValueScore(car) {
        const currentYear = new Date().getFullYear();
        const age = Math.max(1, currentYear - car.year);
        const expectedMileage = age * 20000;
        const mileageRatio = expectedMileage / Math.max(5000, car.mileage);
        const efficiencyScore = Math.min(100, Math.round(mileageRatio * 50));
        const calculatedScore = Math.round(car.priceScore * 0.35 +
            car.trustScore * 0.25 +
            car.demandScore * 0.15 +
            car.conditionScore * 0.15 +
            efficiencyScore * 0.10);
        return Math.min(100, Math.max(0, calculatedScore));
    }
    matchesFilters(car, filters) {
        for (const key of Object.keys(filters)) {
            if (key === '$or') {
                const orConditions = filters.$or;
                const matchAny = orConditions.some((cond) => this.matchesFilters(car, cond));
                if (!matchAny)
                    return false;
                continue;
            }
            const value = car[key];
            const filterVal = filters[key];
            if (filterVal && typeof filterVal === 'object') {
                if (filterVal.$regex) {
                    const regex = new RegExp(filterVal.$regex, filterVal.$options || 'i');
                    if (typeof value === 'string') {
                        if (!regex.test(value))
                            return false;
                    }
                    else {
                        return false;
                    }
                }
                if (filterVal.$gte !== undefined && value < filterVal.$gte)
                    return false;
                if (filterVal.$lte !== undefined && value > filterVal.$lte)
                    return false;
            }
            else {
                if (typeof value === 'string' && typeof filterVal === 'string') {
                    if (value.toLowerCase() !== filterVal.toLowerCase())
                        return false;
                }
                else {
                    if (value !== filterVal)
                        return false;
                }
            }
        }
        return true;
    }
    async create(carData) {
        if (this.isDbConnected()) {
            const newCar = new car_model_1.CarModel(carData);
            return await newCar.save();
        }
        const id = new mongoose.Types.ObjectId().toHexString();
        const newCar = {
            _id: id,
            ...carData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        newCar.valueScore = this.computeInMemoryValueScore(newCar);
        CarRepository_1.inMemoryStore.push(newCar);
        return newCar;
    }
    async findAll(filters, pagination) {
        const page = Math.max(1, pagination.page);
        let limit = Math.max(1, pagination.limit);
        if (limit > 50) {
            limit = 50;
        }
        const skip = (page - 1) * limit;
        if (this.isDbConnected()) {
            const [cars, total] = await Promise.all([
                car_model_1.CarModel.find(filters)
                    .sort({ valueScore: -1, price: 1 })
                    .skip(skip)
                    .limit(limit)
                    .select('-__v -createdAt -updatedAt')
                    .exec(),
                car_model_1.CarModel.countDocuments(filters).exec(),
            ]);
            return { cars, total };
        }
        const filteredCars = CarRepository_1.inMemoryStore.filter((car) => this.matchesFilters(car, filters));
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
    async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        if (this.isDbConnected()) {
            return await car_model_1.CarModel.findById(id).select('-__v').exec();
        }
        const car = CarRepository_1.inMemoryStore.find((c) => c._id === id);
        if (!car)
            return null;
        const { __v, ...cleanCar } = car;
        return cleanCar;
    }
    async update(id, updateData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        if (this.isDbConnected()) {
            const carInstance = await car_model_1.CarModel.findById(id);
            if (!carInstance) {
                return null;
            }
            Object.assign(carInstance, updateData);
            return await carInstance.save();
        }
        const index = CarRepository_1.inMemoryStore.findIndex((c) => c._id === id);
        if (index === -1)
            return null;
        const existingCar = CarRepository_1.inMemoryStore[index];
        const updatedCar = {
            ...existingCar,
            ...updateData,
            updatedAt: new Date(),
        };
        updatedCar.valueScore = this.computeInMemoryValueScore(updatedCar);
        CarRepository_1.inMemoryStore[index] = updatedCar;
        return updatedCar;
    }
    async delete(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }
        if (this.isDbConnected()) {
            const result = await car_model_1.CarModel.deleteOne({ _id: id }).exec();
            return result.deletedCount > 0;
        }
        const initialLength = CarRepository_1.inMemoryStore.length;
        CarRepository_1.inMemoryStore = CarRepository_1.inMemoryStore.filter((c) => c._id !== id);
        return CarRepository_1.inMemoryStore.length < initialLength;
    }
    async getBestDeals(limitCap) {
        const limit = Math.min(50, Math.max(1, limitCap));
        if (this.isDbConnected()) {
            return await car_model_1.CarModel.find()
                .sort({ valueScore: -1, price: 1 })
                .limit(limit)
                .select('-__v -createdAt -updatedAt')
                .exec();
        }
        const sorted = [...CarRepository_1.inMemoryStore].sort((a, b) => {
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
};
exports.CarRepository = CarRepository;
exports.CarRepository = CarRepository = CarRepository_1 = __decorate([
    (0, common_1.Injectable)()
], CarRepository);
//# sourceMappingURL=car.repository.js.map