import { z } from 'zod';

const createNotificationZodSchema = z.object({
  ownerId: z.string({ required_error: 'Owner id is required' }),
  key: z.string({ required_error: 'Key is required' }),
  data: z.object({}),
  receiverId: z.string({ required_error: 'Receiver id is required' }),
  notifyAdmin: z.boolean().optional(),
  isRead: z.boolean().optional(),
});

export const NotificationValidation = {
  createNotificationZodSchema,
};
