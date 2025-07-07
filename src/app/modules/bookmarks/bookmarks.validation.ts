import { z } from 'zod';

const BookmarksValidation = z.object({
  isDeleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const BookmarksValidationSchema = {
  BookmarksValidation,
};
