import { z } from 'zod';

const createIncomeSchema = z.object({
  body: z.object({
    clientName: z
      .string()
      .min(1, 'Client name is required')
      .max(100, 'Client name is too long'),

    amount: z
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .positive('Amount must be positive'),

    transactionDate: z
      .string({
        required_error: 'Transaction date is required',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      }),
  }),
});

export const EarningValidation = {
  createIncomeSchema,
};
