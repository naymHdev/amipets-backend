import { z } from 'zod';

const aboutSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'About section title cannot be empty'),
    description: z
      .string()
      .min(20, 'About section description cannot be empty'),
  }),
});

const privacyPolicySchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Privacy Policy title cannot be empty'),
    description: z
      .string()
      .min(20, 'Privacy Policy description cannot be empty'),
  }),
});

const termsOfServiceSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Terms of Service title cannot be empty'),
    description: z
      .string()
      .min(20, 'Terms of Service description cannot be empty'),
  }),
});

export const AdminValidation = {
  aboutSchema,
  privacyPolicySchema,
  termsOfServiceSchema,
};
