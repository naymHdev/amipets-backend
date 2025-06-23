import { Types } from 'mongoose';

export interface IMyPet {
  _id?: string;
  pet_image: string;
  full_name: string;
  breed: string;
  gender: 'Male' | 'Female';
  chip_number: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: Types.ObjectId;
}
