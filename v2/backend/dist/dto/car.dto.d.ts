import { z } from 'zod';
export declare const CreateCarSchema: z.ZodObject<{
    brand: z.ZodString;
    model: z.ZodString;
    year: z.ZodNumber;
    price: z.ZodNumber;
    mileage: z.ZodNumber;
    location: z.ZodString;
    imageUrl: z.ZodString;
    conditionScore: z.ZodNumber;
    priceScore: z.ZodNumber;
    demandScore: z.ZodNumber;
    trustScore: z.ZodNumber;
}, z.core.$strip>;
export declare const UpdateCarSchema: z.ZodObject<{
    brand: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    mileage: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    conditionScore: z.ZodOptional<z.ZodNumber>;
    priceScore: z.ZodOptional<z.ZodNumber>;
    demandScore: z.ZodOptional<z.ZodNumber>;
    trustScore: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateCarDto = z.infer<typeof CreateCarSchema>;
export type UpdateCarDto = z.infer<typeof UpdateCarSchema>;
