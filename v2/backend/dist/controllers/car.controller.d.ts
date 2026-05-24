import { CarService } from '../services/car.service';
export declare class CarController {
    private readonly carService;
    constructor(carService: CarService);
    create(createCarDto: any): Promise<import("../models/car.model").ICar>;
    findAll(query: Record<string, any>, req: any): Promise<{
        cars: import("../models/car.model").ICar[];
        total: number;
        page: number;
        limit: number;
    }>;
    getBestDeals(limit?: string): Promise<import("../models/car.model").ICar[]>;
    findOne(id: string): Promise<import("../models/car.model").ICar>;
    update(id: string, updateCarDto: any): Promise<import("../models/car.model").ICar>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
