/* eslint-disable no-unused-vars */

import { Model } from 'mongoose';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SHELTER = 'shelter',
}
export type TUserGender = 'male' | 'female' | 'other';

export interface IUser {
  _id?: string; 
  full_name?: string;
  first_name: string;
  last_name?: string;
  gender: TUserGender;
  location?: string;
  contact_number?: number;
  email: string;
  password: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
  profile_image?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  webLink?: string;
  verification?: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  
  // For Shelter
  shelter_name?: string;
}

//  For login
export interface IAuth {
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserExistByEmail(id: string): Promise<IUser | null>;
  checkUserExist(userId: string): Promise<IUser | null>;
}

export type TUserRole = keyof typeof Role;

export interface IJwtPayload {
  _id: string;
  email: string;
  role: Role;
  first_name: string;
  last_name: string;
  isActive: boolean;
}
