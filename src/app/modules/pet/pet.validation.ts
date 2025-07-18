import { z } from 'zod';

const createPetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters'),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z
        .tuple([
          z.number().min(-180).max(180), // lng
          z.number().min(-90).max(90), // lat
        ])
        .refine((coords) => coords.length === 2, {
          message: 'Coordinates must be [lng, lat]',
        }),
      address: z.string().min(3, 'Address is required'),
    }),
    description: z.string({ required_error: 'Description is required' }),
    neutered: z.boolean({ required_error: 'Neutered is required' }),
    vaccinated: z.boolean({ required_error: 'Vaccinated is required' }),
    weight: z.string({ required_error: 'Weight is required' }),
    chip_number: z.string({ required_error: 'Chip number is required' }),
    breed: z
      .string({ required_error: 'Breed is required' })
      .min(2, 'Breed must be at least 2 characters'),
    gender: z.enum(['Male', 'Female'], {
      required_error: 'Gender is required',
    }),
    age: z.string({ required_error: 'Date of birth is required' }),
    pet_category: z.enum(['dog', 'cat'], {
      required_error: 'Pet category is required',
    }),
    isAdopted: z.boolean().optional(),
    isBookmarked: z.boolean().optional(),
  }),
});

const updatePetePetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .optional(),
    location: z.object({
      type: z.literal('Point').optional(),
      coordinates: z
        .tuple([
          z.number().min(-180).max(180), // lng
          z.number().min(-90).max(90), // lat
        ])
        .refine((coords) => coords.length === 2, {
          message: 'Coordinates must be [lng, lat]',
        })
        .optional(),
      address: z.string().min(3, 'Address is required').optional(),
    }),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    neutered: z.boolean({ required_error: 'Neutered is required' }).optional(),
    vaccinated: z
      .boolean({ required_error: 'Vaccinated is required' })
      .optional(),
    weight: z.string({ required_error: 'Weight is required' }).optional(),
    chip_number: z
      .string({ required_error: 'Chip number is required' })
      .optional(),
    breed: z
      .string({ required_error: 'Breed is required' })
      .min(2, 'Breed must be at least 2 characters')
      .optional(),
    gender: z
      .enum(['Male', 'Female'], {
        required_error: 'Gender is required',
      })
      .optional(),
    age: z.string({ required_error: 'Date of birth is required' }).optional(),
    pet_category: z
      .enum(['dog', 'cat'], {
        required_error: 'Pet category is required',
      })
      .optional(),
    isAdopted: z.boolean().optional(),
    isBookmarked: z.boolean().optional(),
  }),
});

export const petValidation = {
  createPetSchema,
  updatePetePetSchema,
};
