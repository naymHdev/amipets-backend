import { z } from 'zod';

const surveyValidationSchema = z.object({
  body: z.object({
    shelter_owner: z.string({ required_error: 'Shelter owner is required' }),
    question: z.string({ required_error: 'Question is required' }),
    answer: z.string({ required_error: 'Answer is required' }).optional(),
    priority: z.enum(['required', 'optional'], {
      required_error: 'Priority is required',
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

export const ShelterValidation = {
  surveyValidationSchema,
  EditSurveyValidationSchema,
};
