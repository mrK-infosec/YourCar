import { CarRepository } from '../repositories/car.repository';
import { CacheService } from './cache.service';
import { ICar } from '../models/car.model';
export declare class CarService {
    private readonly carRepository;
    private readonly cacheService;
    constructor(carRepository: CarRepository, cacheService: CacheService);
    create(carData: any): Promise<ICar>;
    findAll(queryParams: Record<string, any>): Promise<{
        cars: ICar[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<ICar>;
    update(id: string, updateData: any): Promise<ICar>;
    remove(id: string): Promise<void>;
    getBestDeals(limit?: number): Promise<ICar[]>;
}
