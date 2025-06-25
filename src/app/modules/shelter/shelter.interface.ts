import { Types } from 'mongoose';

export interface ISurvey {
  shelter_owner: Types.ObjectId;
  question: string;
  answer?: string;
  priority: 'required' | 'optional';
}
