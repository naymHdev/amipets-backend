import { z } from 'zod';
import { Role } from './auth.interface';

export const verificationSchema = z.object({
  otp: z.union([z.string(), z.number()]).default('0'),
  expiresAt: z.coerce.date(),
  status: z.boolean().default(false),
});

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
    isDeleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    contact_number: z.number().optional(),
    isActive: z.boolean().optional(),
    verification: verificationSchema.optional(),
  }),
});

const forgotPassValidation = z.object({
  body: z.object({
    email: z.string().email({ message: 'Provide a valid email, try again' }),
  }),
});

const resetPassValidation = z.object({
  body: z.object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const userProfileUpdateValidationSchema = z.object({
  full_name: z.string({ required_error: 'First name is required' }).optional(),
  email: z
    .string()
    .email({ message: 'Provide a valid email, try again' })
    .optional(),
  location: z.string({ required_error: 'Provide a valid location' }).optional(),
});

export const AuthValidation = {
  userValidationSchema,
  forgotPassValidation,
  resetPassValidation,
  userProfileUpdateValidationSchema,
};
