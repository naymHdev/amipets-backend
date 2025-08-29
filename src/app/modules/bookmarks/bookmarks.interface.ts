import { Types } from 'mongoose';

export interface IBookmarks {
  _id?: string;
  pet_id: Types.ObjectId;
  user_id: Types.ObjectId;
  isDeleted: boolean;
  isActive: boolean;
}
