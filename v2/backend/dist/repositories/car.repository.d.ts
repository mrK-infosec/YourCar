import { ICar } from '../models/car.model';
export declare class CarRepository {
    private static inMemoryStore;
    private isDbConnected;
    private computeInMemoryValueScore;
    private matchesFilters;
    create(carData: Partial<ICar>): Promise<ICar>;
    findAll(filters: Record<string, any>, pagination: {
        page: number;
        limit: number;
    }): Promise<{
        cars: ICar[];
        total: number;
    }>;
    findById(id: string): Promise<ICar | null>;
    update(id: string, updateData: Partial<ICar>): Promise<ICar | null>;
    delete(id: string): Promise<boolean>;
    getBestDeals(limitCap: number): Promise<ICar[]>;
}
