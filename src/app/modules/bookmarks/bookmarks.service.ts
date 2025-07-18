import { Types } from 'mongoose';
import { IBookmarks } from './bookmarks.interface';
import { Bookmarks } from './bookmarks.model';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import Pet from '../pet/pet.model';

const createBookmarksFromDB = async (petId: string, userId: string) => {
  const payload: IBookmarks = {
    user_id: new Types.ObjectId(userId),
    pet_id: new Types.ObjectId(petId),
    isDeleted: false,
    isActive: true,
  };

  const result = await Bookmarks.create(payload);

  // update pet isBookmarked
  await Pet.findOneAndUpdate(
    { _id: payload.pet_id },
    { $set: { isBookmarked: true } },
    { new: true },
  );

  return result;
};

const getAllBookmarksFromDB = async (userId: string) => {
  const result = await Bookmarks.find({ user_id: userId })
    .populate('pet_id')
    .populate('user_id');
  return result;
};

const getDetailsFromDB = async (id: string) => {
  const result = await Bookmarks.findById(id)
    .populate('pet_id')
    .populate('user_id');
  return result;
};

const deletedBookmarksFromDB = async (id: string) => {
  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Id is required');
  }

  const result = await Bookmarks.findByIdAndDelete(id);

  // update pet isBookmarked
  await Pet.findOneAndUpdate(
    { _id: id },
    { $set: { isBookmarked: false } },
    { new: true },
  );

  return result;
};

export const BookmarksService = {
  createBookmarksFromDB,
  getDetailsFromDB,
  getAllBookmarksFromDB,
  deletedBookmarksFromDB,
};
