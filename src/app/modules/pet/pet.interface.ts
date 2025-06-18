// interfaces/pet.interface.ts

import { Types } from 'mongoose';

export interface IPet {
  _id?: string;
  full_name: string;
  pet_image: string;
  chip_number: string;
  breed: string;
  gender: 'Male' | 'Female';
  date_of_birth: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: Types.ObjectId;
}
