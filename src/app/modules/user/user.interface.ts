import { Types } from 'mongoose';

export interface IMyPet {
  _id?: string;
  pet_image: string;
  full_name: string;
  breed: string;
  gender: 'Male' | 'Female';
  chip_number: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// Pet Adopt Interface
export interface IPetAdopt {
  _id?: string;
  adopted_pet: Types.ObjectId;
  adopter: Types.ObjectId;
  answers: {
    question: string;
    answer: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
