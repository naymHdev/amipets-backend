import { Types } from 'mongoose';

export interface IPet {
  _id?: string;
  pet_image: string[];
  full_name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    address?: string;
  };
  description?: string;
  breed?: string;
  gender: 'Male' | 'Female';
  neutered?: boolean;
  chipped?: boolean;
  chip_number?: string;
  vaccinated?: boolean;
  weight?: string;
  date_of_birth: Date;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: Types.ObjectId;
  pet_category: 'dog' | 'cat' | 'both';
  isAdopted?: boolean;
  isBookmarked?: boolean;
}
