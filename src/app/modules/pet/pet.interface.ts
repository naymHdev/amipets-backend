import { Types } from 'mongoose';

export interface IPet {
  _id?: string;
  pet_image: string[];
  full_name: string;
  city: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  description?: string;
  breed?: string;
  gender: 'Male' | 'Female';
  neutered?: 'Yes' | 'No' | 'N/A';
  chipped?: 'Yes' | 'No' | 'N/A';
  chip_number?: string;
  vaccinated?: 'Yes' | 'No' | 'N/A';
  weight?: string;
  date_of_birth: Date;
  createdAt?: Date;
  updatedAt?: Date;
  owner?: Types.ObjectId;
  pet_category: 'dog' | 'cat' | 'both';
  isAdopted?: boolean;
  isBookmarked?: boolean;

  pet_status?:
    | 'adopted'
    | 'deceased'
    | 'in quarantine'
    | 'reserved'
    | 'available';
  medical_notes?: string;
  pet_reports?: string[];
  internal_notes?: string;
}
