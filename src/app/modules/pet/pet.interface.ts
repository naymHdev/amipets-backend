import { Types } from 'mongoose';

export interface IPet {
  _id?: string;
  pet_image: string[];
  full_name: string;
  location: string;
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
  service: Types.ObjectId;
  serviceName: string;
}
