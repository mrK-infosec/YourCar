"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarModel = exports.CarSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CarSchema = new mongoose_1.Schema({
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true, index: true },
    year: { type: Number, required: true, index: true },
    price: { type: Number, required: true, index: true },
    mileage: { type: Number, required: true, index: true },
    location: { type: String, required: true, trim: true, index: true },
    imageUrl: { type: String, required: true, trim: true },
    conditionScore: { type: Number, required: true, min: 0, max: 100 },
    priceScore: { type: Number, required: true, min: 0, max: 100 },
    demandScore: { type: Number, required: true, min: 0, max: 100 },
    trustScore: { type: Number, required: true, min: 0, max: 100 },
    valueScore: { type: Number, default: 0, index: true },
}, {
    timestamps: true,
});
exports.CarSchema.index({ valueScore: -1, price: 1 });
exports.CarSchema.index({ brand: 1, model: 1, year: -1 });
exports.CarSchema.pre('save', function (next) {
    const currentYear = new Date().getFullYear();
    const age = Math.max(1, currentYear - this.year);
    const expectedMileage = age * 20000;
    const mileageRatio = expectedMileage / Math.max(5000, this.mileage);
    const efficiencyScore = Math.min(100, Math.round(mileageRatio * 50));
    const calculatedScore = Math.round(this.priceScore * 0.35 +
        this.trustScore * 0.25 +
        this.demandScore * 0.15 +
        this.conditionScore * 0.15 +
        efficiencyScore * 0.10);
    this.valueScore = Math.min(100, Math.max(0, calculatedScore));
    next();
});
exports.CarModel = mongoose_1.models.Car || (0, mongoose_1.model)('Car', exports.CarSchema);
exports.default = exports.CarModel;
//# sourceMappingURL=car.model.js.map