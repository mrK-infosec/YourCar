"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCarSchema = exports.CreateCarSchema = void 0;
const zod_1 = require("zod");
exports.CreateCarSchema = zod_1.z.object({
    brand: zod_1.z.string().min(2, { message: 'Brand must be at least 2 characters' }),
    model: zod_1.z.string().min(1, { message: 'Model must be specified' }),
    year: zod_1.z.number().min(1900).max(new Date().getFullYear() + 1, { message: 'Year must be a valid manufacturing date' }),
    price: zod_1.z.number().min(0, { message: 'Price cannot be negative' }),
    mileage: zod_1.z.number().min(0, { message: 'Mileage cannot be negative' }),
    location: zod_1.z.string().min(2, { message: 'UAE city location is required' }),
    imageUrl: zod_1.z.string().url({ message: 'Must be a valid image path URL' }),
    conditionScore: zod_1.z.number().min(0).max(100, { message: 'Condition score must be between 0 and 100' }),
    priceScore: zod_1.z.number().min(0).max(100, { message: 'Price competitiveness must be between 0 and 100' }),
    demandScore: zod_1.z.number().min(0).max(100, { message: 'Market demand must be between 0 and 100' }),
    trustScore: zod_1.z.number().min(0).max(100, { message: 'Dealer trust score must be between 0 and 100' }),
});
exports.UpdateCarSchema = exports.CreateCarSchema.partial();
//# sourceMappingURL=car.dto.js.map