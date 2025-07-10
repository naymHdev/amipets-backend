import { z } from 'zod';

const changePasswordUpdateValidationSchema = z.object({
  body: z.object({
    current_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    new_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirm_password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  }),
});

// ------------------ My Pet Validation Schema ------------------
const myPetValidationSchema = z.object({
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
  }),
});

const updateMyPetValidationSchema = z.object({
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
  }),
});

const petAdoptedValidationSchema = z.object({
  body: z.object({
    adopted_pet: z.string({ required_error: 'Pet id is required' }),
    answers: z
      .array(
        z.object({
          question: z
            .string({ required_error: 'Question is required' })
            .min(1, 'Question cannot be empty'),
          answer: z
            .string({ required_error: 'Answer is required' })
            .min(1, 'Answer cannot be empty'),
        }),
      )
      .nonempty({ message: 'At least one answer is required' }),
  }),
  status: z
    .enum(['accepted', 'rejected', 'pending'], {
      required_error: 'Status is required! (accepted or rejected or pending)',
    })
    .default('pending')
    .optional(),
});

export const UserValidation = {
  changePasswordUpdateValidationSchema,
  myPetValidationSchema,
  updateMyPetValidationSchema,
  petAdoptedValidationSchema,
};
