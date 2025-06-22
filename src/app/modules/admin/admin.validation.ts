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

// ------------------------------- Banner Validation -------------------------------
const bannerSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Banner title cannot be empty'),
    description: z.string().min(10, 'Banner description cannot be empty'),
    link: z.string({ required_error: 'Banner link cannot be empty' }),
    websiteLink: z.string({ required_error: 'Website link cannot be empty' }),
  }),
});

const updateBannerSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Banner title cannot be empty').optional(),
    description: z
      .string()
      .min(10, 'Banner description cannot be empty')
      .optional(),
    link: z
      .string({ required_error: 'Banner link cannot be empty' })
      .optional(),
    websiteLink: z
      .string({ required_error: 'Website link cannot be empty' })
      .optional(),
  }),
});

// -------------------------------- Services Validation Schemas -------------------------------

const servicesSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Service name cannot be empty'),
    isActive: z.boolean().default(true).optional(),
  }),
});

const updateServicesSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Service name cannot be empty').optional(),
    isActive: z.boolean().default(true).optional(),
  }),
});

// ---------------------------- Add website Validation Schemas ----------------------------

const addWebsiteSchema = z.object({
  body: z.object({
    web_name: z.string().min(3, 'Website name cannot be empty'),
    web_link: z.string({ required_error: 'Website link cannot be empty' }),
    pet_type: z.enum(['dog', 'cat', 'both'], {
      required_error: 'Pet type is required',
    }),
    description: z.string().min(10, 'Description cannot be empty'),
    location: z.string().min(3, 'Location cannot be empty'),
  }),
});

// ---------------------------- Admin Profile Validation Schemas ----------------------------
const adminProfileUpdateValidationSchema = z.object({
  body: z.object({
    full_name: z.string().optional(),
    email: z.string().email().optional(),
    contact_number: z.number().optional(),
  }),
});

export const AdminValidation = {
  aboutSchema,
  updateAboutSchema,
  privacyPolicySchema,
  updatePrivacyPolicySchema,
  termsOfServiceSchema,
  updateTermsOfServiceSchema,
  bannerSchema,
  updateBannerSchema,
  servicesSchema,
  updateServicesSchema,
  addWebsiteSchema,
  adminProfileUpdateValidationSchema,
};
