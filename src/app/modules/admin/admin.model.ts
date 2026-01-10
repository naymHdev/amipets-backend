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
    versionKey: false,
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
    versionKey: false,
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
    bannerInfo: [
      {
        image: {
          type: String,
          required: false,
        },
        websiteLink: {
          type: String,
          required: true,
        },
      },
    ],
    banner: {
      type: String,
      default: 'banner',
    },
  },
  {
    timestamps: true,
    versionKey: false,
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
    position: {
      type: Number,
      required: false,
      default: null,
    },
    service_tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
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
    position: { type: Number, required: false },
    service_tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Auto-generate position if not provided
// AddWebsiteSchema.pre('save', async function (next) {
//   if (this.isNew && (this.position === null || this.position === undefined)) {
//     const Model = this
//       .constructor as typeof import('mongoose').Model<IAddWebsite>;
//     const lastWebsite = await Model.findOne().sort({ position: -1 });
//     this.position = lastWebsite ? lastWebsite.position + 1 : 1;
//   }
//   next();
// });

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
