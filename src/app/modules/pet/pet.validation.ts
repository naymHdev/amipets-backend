import { z } from 'zod';

const createPetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters'),
    city: z.string({ required_error: 'City is required' }),
    address: z.string().optional(),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z
        .tuple([
          z.number().min(-180).max(180), // lng
          z.number().min(-90).max(90), // lat
        ])
        .refine((coords) => coords?.length === 2, {
          message: 'Coordinates must be [lng, lat]',
        }),
    }),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    neutered: z
      .enum(['Yes', 'No', 'N/A'], {
        required_error: 'Neutered is required',
      })
      .optional(),
    vaccinated: z.enum(['Yes', 'No', 'N/A']).optional(),
    weight: z.string({ required_error: 'Weight is required' }).optional(),
    chipped: z.enum(['Yes', 'No', 'N/A']).optional(),
    breed: z.string({ required_error: 'Breed is required' }).optional(),
    gender: z.enum(['Male', 'Female'], {
      required_error: 'Gender is required',
    }),
    date_of_birth: z.preprocess(
      (arg) => {
        if (typeof arg === 'string' || arg instanceof Date) {
          return new Date(arg);
        }
      },
      z.date({ required_error: 'Date of birth is required' }),
    ),
    pet_category: z.enum(['dog', 'cat', 'both'], {
      required_error: 'Pet category is required',
    }),
    isAdopted: z.boolean().optional(),
    isBookmarked: z.boolean().optional(),
    pet_status: z
      .enum(['adopted', 'deceased', 'in quarantine', 'reserved', 'available'], {
        required_error: 'Pet status is required',
      })
      .default('available')
      .optional(),
  }),
});

const updatePetePetSchema = z.object({
  body: z.object({
    full_name: z.string({ required_error: 'Full name is required' }).optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    location: z.object({
      type: z.literal('Point').optional(),
      coordinates: z
        .tuple([
          z.number().min(-180).max(180), // lng
          z.number().min(-90).max(90), // lat
        ])
        .refine((coords) => coords?.length === 2, {
          message: 'Coordinates must be [lng, lat]',
        })
        .optional(),
    }),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    neutered: z
      .enum(['Yes', 'No', 'N/A'], {
        required_error: 'Neutered is required',
      })
      .optional(),
    vaccinated: z.enum(['Yes', 'No', 'N/A']).optional(),
    weight: z.string({ required_error: 'Weight is required' }).optional(),
    chipped: z.enum(['Yes', 'No', 'N/A']).optional(),
    breed: z.string({ required_error: 'Breed is required' }).optional(),
    gender: z
      .enum(['Male', 'Female'], {
        required_error: 'Gender is required',
      })
      .optional(),
    date_of_birth: z
      .string({ required_error: 'Date of birth is required' })
      .optional(),
    pet_category: z
      .enum(['dog', 'cat', 'both'], {
        required_error: 'Pet category is required',
      })
      .optional(),
    isAdopted: z.boolean().optional(),
    isBookmarked: z.boolean().optional(),
    pet_status: z
      .enum(['adopted', 'deceased', 'in quarantine', 'reserved', 'available'], {
        required_error: 'Pet status is required',
      })
      .default('available')
      .optional(),
  }),
});

export const petValidation = {
  createPetSchema,
  updatePetePetSchema,
};
