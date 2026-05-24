import { Schema, model, models } from 'mongoose';

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

export const CarSchema: Schema<ICar> = new Schema<ICar>(
  {
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
  },
  {
    timestamps: true,
  }
);

// High-speed compound indexes for search optimization and sorted views
CarSchema.index({ valueScore: -1, price: 1 });
CarSchema.index({ brand: 1, model: 1, year: -1 });

// Dynamic pre-save value score engine (SaaS Decision-Grade Ranking)
CarSchema.pre('save', function (this: any, next: any) {
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - this.year);
  
  // UAE Average mileage expected is ~20,000 km per year
  const expectedMileage = age * 20000;
  const mileageRatio = expectedMileage / Math.max(5000, this.mileage);
  const efficiencyScore = Math.min(100, Math.round(mileageRatio * 50));

  // Compute weighted sum
  const calculatedScore = Math.round(
    this.priceScore * 0.35 +
    this.trustScore * 0.25 +
    this.demandScore * 0.15 +
    this.conditionScore * 0.15 +
    efficiencyScore * 0.10
  );

  this.valueScore = Math.min(100, Math.max(0, calculatedScore));
  next();
});

// Avoid double model compilation during NestJS hot reloads
export const CarModel = models.Car || model<ICar>('Car', CarSchema);
export default CarModel;
