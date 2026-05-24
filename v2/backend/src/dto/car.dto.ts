import { z } from 'zod';

export const CreateCarSchema = z.object({
  brand: z.string().min(2, { message: 'Brand must be at least 2 characters' }),
  model: z.string().min(1, { message: 'Model must be specified' }),
  year: z.number().min(1900).max(new Date().getFullYear() + 1, { message: 'Year must be a valid manufacturing date' }),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
  mileage: z.number().min(0, { message: 'Mileage cannot be negative' }),
  location: z.string().min(2, { message: 'UAE city location is required' }),
  imageUrl: z.string().url({ message: 'Must be a valid image path URL' }),
  conditionScore: z.number().min(0).max(100, { message: 'Condition score must be between 0 and 100' }),
  priceScore: z.number().min(0).max(100, { message: 'Price competitiveness must be between 0 and 100' }),
  demandScore: z.number().min(0).max(100, { message: 'Market demand must be between 0 and 100' }),
  trustScore: z.number().min(0).max(100, { message: 'Dealer trust score must be between 0 and 100' }),
});

export const UpdateCarSchema = CreateCarSchema.partial();

export type CreateCarDto = z.infer<typeof CreateCarSchema>;
export type UpdateCarDto = z.infer<typeof UpdateCarSchema>;
