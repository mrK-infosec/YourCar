import { Schema } from 'mongoose';
export interface ICar {
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    location: string;
    imageUrl: string;
    conditionScore: number;
    priceScore: number;
    demandScore: number;
    trustScore: number;
    valueScore: number;
}
export declare const CarSchema: Schema<ICar>;
export declare const CarModel: import("mongoose").Model<any, {}, {}, {}, any, any, any>;
export default CarModel;
