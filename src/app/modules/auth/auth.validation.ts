import { z } from 'zod';
import { Role } from './auth.interface';

const userValidationSchema = z.object({
  body: z.object({
    first_name: z
      .string({ required_error: 'First name is required' })
      .min(3, { message: 'First name must be at least 3 characters' }),
    last_name: z.string().optional(),
    email: z.string().email({ message: 'Provide a valid email, try again' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum([Role.ADMIN, Role.SHELTER, Role.USER]).default(Role.USER),
    location: z.string({ required_error: 'Provide a valid location' }),
    profile_image: z.string().optional(),
    isDeleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    contact_number: z.number().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const AuthValidation = {
  userValidationSchema,
};
