import { model, Schema } from 'mongoose';
import { IAbout, IPrivacyPolicy } from './admin.interface';

const AboutSchema = new Schema<IAbout>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PrivacyPolicySchema = new Schema<IPrivacyPolicy>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TermsOfServiceSchema = new Schema<IPrivacyPolicy>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const About = model<IAbout>('About', AboutSchema);
export const PrivacyPolicy = model<IPrivacyPolicy>(
  'PrivacyPolicy',
  PrivacyPolicySchema,
);
export const TermsOfService = model<IPrivacyPolicy>(
  'TermsOfService',
  TermsOfServiceSchema,
);
