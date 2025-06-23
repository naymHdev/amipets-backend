import { z } from 'zod';

const createPetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters'),
    location: z.string({ required_error: 'Location is required' }),
    description: z.string({ required_error: 'Description is required' }),
    neutered: z.boolean({ required_error: 'Neutered is required' }),
    vaccinated: z.boolean({ required_error: 'Vaccinated is required' }),
    weight: z.string({ required_error: 'Weight is required' }),
    chip_number: z
      .string({ required_error: 'Chip number is required' })
      .length(10, 'Chip number must be exactly 10 digits'),
    breed: z
      .string({ required_error: 'Breed is required' })
      .min(2, 'Breed must be at least 2 characters'),
    gender: z.enum(['Male', 'Female'], {
      required_error: 'Gender is required',
    }),
    age: z.string({ required_error: 'Date of birth is required' }),
    owner: z.string({ required_error: 'Owner id is required' }),
  }),
});

const updatePetePetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .optional(),
    location: z.string({ required_error: 'Location is required' }).optional(),
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
      .length(10, 'Chip number must be exactly 10 digits')
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
    owner: z.string({ required_error: 'Owner id is required' }).optional(),
  }),
});

export const petValidation = {
  createPetSchema,
  updatePetePetSchema,
};
