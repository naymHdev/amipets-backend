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

export const UserValidation = {
  changePasswordUpdateValidationSchema,
};
