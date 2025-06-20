import { model, Schema } from 'mongoose';
import { IAbout, IBanner, IPrivacyPolicy } from './admin.interface';

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

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: true,
    },
    websiteLink: {
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

export const Banner = model<IBanner>('Banner', BannerSchema);
