import { Types } from 'mongoose';

export interface INotification {
  ownerId: Types.ObjectId;
  key: string;
  data: Record<string, unknown>;
  receiverId: Types.ObjectId[];
  notifyAdmin?: boolean;
  notifyUser?: boolean;
  notifyShelter?: boolean;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Used for input validation, accepts string IDs instead of ObjectIds
export type TNotification = Partial<
  Omit<INotification, 'ownerId' | 'receiverId'>
> & {
  ownerId: string;
  receiverId: string[];
};
