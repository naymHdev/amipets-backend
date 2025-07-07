import { Types } from 'mongoose';

export interface IBookmarks {
  pet_id: Types.ObjectId;
  user_id: Types.ObjectId;
  isDeleted: boolean;
  isActive: boolean;
}
