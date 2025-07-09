import { z } from 'zod';

const surveyValidationSchema = z.object({
  body: z.object({
    question: z.string({ required_error: 'Question is required' }),
    answer: z.string({ required_error: 'Answer is required' }).optional(),
    priority: z.enum(['required', 'optional'], {
      required_error: 'Priority is required! (required or optional)',
    }),
    status: z.enum(['accepted', 'rejected', 'pending'], {
      required_error: 'Status is required! (accepted or rejected or pending)',
    }),
  }),
});

const EditSurveyValidationSchema = z.object({
  body: z.object({
    question: z.string({ required_error: 'Question is required' }).optional(),
    answer: z.string({ required_error: 'Answer is required' }).optional(),
    priority: z
      .enum(['required', 'optional'], {
        required_error: 'Priority is required',
      })
      .optional(),
  }),
});

const updateUserRequestStatus = z.object({
  body: z
    .object({
      status: z.enum(['accepted', 'rejected', 'pending'], {
        required_error: 'Status is required! (accepted or rejected or pending)',
      }),
    })
    .optional(),
});

export const ShelterValidation = {
  surveyValidationSchema,
  EditSurveyValidationSchema,
  updateUserRequestStatus,
};
