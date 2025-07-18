import { Types } from 'mongoose';

export interface IPet {
  _id?: string;
  pet_image: string[];
  full_name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
    address: string;
  };
  description: string;
  breed: string;
  gender: 'Male' | 'Female';
  neutered: boolean;
  chip_number: string;
  vaccinated: boolean;
  weight: string;
  age: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: Types.ObjectId;
  pet_category: 'dog' | 'cat' | 'other';
  isAdopted?: boolean;
  isBookmarked?: boolean;
}
