import { model, Schema } from 'mongoose';
import {
  IAbout,
  IAddWebsite,
  IBanner,
  IPrivacyPolicy,
  IService,
} from './admin.interface';

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

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const AddWebsiteSchema = new Schema<IAddWebsite>(
  {
    web_name: {
      type: String,
      required: true,
    },
    web_link: {
      type: String,
      required: true,
    },
    web_img: {
      type: String,
      required: false,
    },
    pet_type: {
      type: String,
      enum: ['dog', 'cat', 'both'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceName: {
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

export const Service = model<IService>('Service', ServiceSchema);

export const AddWebsite = model<IAddWebsite>('AddWebsite', AddWebsiteSchema);
