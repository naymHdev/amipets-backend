import { Schema, model } from 'mongoose';
import { ISurvey } from './shelter.interface';

const SurveySchema = new Schema<ISurvey>({
  shelter_owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    enum: ['required', 'optional'],
    required: true,
  }
});

export const Survey = model<ISurvey>('Survey', SurveySchema);
