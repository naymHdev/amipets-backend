import { z } from 'zod';

const createPetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters'),
    chip_number: z
      .string({ required_error: 'Chip number is required' })
      .length(10, 'Chip number must be exactly 10 digits'),
    breed: z
      .string({ required_error: 'Breed is required' })
      .min(2, 'Breed must be at least 2 characters'),
    gender: z.enum(['Male', 'Female'], {
      required_error: 'Gender is required',
    }),
    date_of_birth: z.string({ required_error: 'Date of birth is required' }),
    owner: z.string({ required_error: 'Owner id is required' }),
  }),
});

const updatePetePetSchema = z.object({
  body: z.object({
    full_name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .optional(),
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
    date_of_birth: z
      .string({ required_error: 'Date of birth is required' })
      .optional(),
    owner: z.string({ required_error: 'Owner id is required' }).optional(),
  }),
});

export const petValidation = {
  createPetSchema,
  updatePetePetSchema,
};
