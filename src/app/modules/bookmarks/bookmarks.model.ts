import mongoose from 'mongoose';
import { IBookmarks } from './bookmarks.interface';
import { Schema } from 'mongoose';

const bookmarksSchema = new Schema<IBookmarks>(
  {
    pet_id: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Bookmarks = mongoose.model<IBookmarks>(
  'Bookmarks',
  bookmarksSchema,
);
