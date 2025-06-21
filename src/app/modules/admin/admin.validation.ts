import { z } from 'zod';

const aboutSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'About section title cannot be empty'),
    description: z
      .string()
      .min(20, 'About section description cannot be empty'),
  }),
});

const updateAboutSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'About section title cannot be empty').optional(),
    description: z
      .string()
      .min(20, 'About section description cannot be empty')
      .optional(),
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

const updatePrivacyPolicySchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Privacy Policy title cannot be empty').optional(),
    description: z
      .string()
      .min(20, 'Privacy Policy description cannot be empty')
      .optional(),
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

const updateTermsOfServiceSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, 'Terms of Service title cannot be empty')
      .optional(),
    description: z
      .string()
      .min(20, 'Terms of Service description cannot be empty')
      .optional(),
  }),
});

export const AdminValidation = {
  aboutSchema,
  updateAboutSchema,
  privacyPolicySchema,
  updatePrivacyPolicySchema,
  termsOfServiceSchema,
  updateTermsOfServiceSchema,
};
