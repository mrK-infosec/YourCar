"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarService = void 0;
const common_1 = require("@nestjs/common");
const car_repository_1 = require("../repositories/car.repository");
const cache_service_1 = require("./cache.service");
let CarService = class CarService {
    carRepository;
    cacheService;
    constructor(carRepository, cacheService) {
        this.carRepository = carRepository;
        this.cacheService = cacheService;
    }
    async create(carData) {
        const car = await this.carRepository.create(carData);
        await this.cacheService.delete('best_deals_10');
        return car;
    }
    async findAll(queryParams) {
        const page = parseInt(queryParams.page || '1', 10);
        const limit = parseInt(queryParams.limit || '10', 10);
        const filters = {};
        if (queryParams.brand) {
            filters.brand = { $regex: queryParams.brand, $options: 'i' };
        }
        if (queryParams.model) {
            filters.model = { $regex: queryParams.model, $options: 'i' };
        }
        if (queryParams.location) {
            filters.location = { $regex: queryParams.location, $options: 'i' };
        }
        if (queryParams.minPrice || queryParams.maxPrice) {
            filters.price = {};
            if (queryParams.minPrice)
                filters.price.$gte = parseFloat(queryParams.minPrice);
            if (queryParams.maxPrice)
                filters.price.$lte = parseFloat(queryParams.maxPrice);
        }
        if (queryParams.minYear || queryParams.maxYear) {
            filters.year = {};
            if (queryParams.minYear)
                filters.year.$gte = parseInt(queryParams.minYear, 10);
            if (queryParams.maxYear)
                filters.year.$lte = parseInt(queryParams.maxYear, 10);
        }
        if (queryParams.maxMileage) {
            filters.mileage = { $lte: parseFloat(queryParams.maxMileage) };
        }
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
    async findOne(id) {
        const car = await this.carRepository.findById(id);
        if (!car) {
            throw new common_1.NotFoundException(`Car with ID ${id} was not found`);
        }
        return car;
    }
    async update(id, updateData) {
        const updatedCar = await this.carRepository.update(id, updateData);
        if (!updatedCar) {
            throw new common_1.NotFoundException(`Car with ID ${id} was not found`);
        }
        await this.cacheService.delete('best_deals_10');
        return updatedCar;
    }
    async remove(id) {
        const success = await this.carRepository.delete(id);
        if (!success) {
            throw new common_1.NotFoundException(`Car with ID ${id} was not found`);
        }
        await this.cacheService.delete('best_deals_10');
    }
    async getBestDeals(limit = 10) {
        const cacheKey = `best_deals_${limit}`;
        const cachedDeals = await this.cacheService.get(cacheKey);
        if (cachedDeals) {
            return cachedDeals;
        }
        const deals = await this.carRepository.getBestDeals(limit);
        await this.cacheService.set(cacheKey, deals, 10);
        return deals;
    }
};
exports.CarService = CarService;
exports.CarService = CarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [car_repository_1.CarRepository,
        cache_service_1.CacheService])
], CarService);
//# sourceMappingURL=car.service.js.map