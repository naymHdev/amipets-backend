import { Types } from "mongoose";

export interface IAbout {
  title: string;
  description: string;
}

export interface IPrivacyPolicy {
  title: string;
  description: string;
}
export interface ITermsOfService {
  title: string;
  description: string;
}

export interface IBanner {
  title: string;
  description: string;
  image: string;
  websiteLink: string;
  banner: string;
}

export interface IService {
  name: string;
  icon: string;
  isActive: boolean;
}

export interface IAddWebsite {
  web_name: string;
  web_link: string;
  web_img: string;
  pet_type: 'dog' | 'cat' | 'both';
  description: string;
  location: string;
  service: Types.ObjectId;
  serviceName: string;
}
