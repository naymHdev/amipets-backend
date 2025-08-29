import { Types } from 'mongoose';
import { IBookmarks } from './bookmarks.interface';
import { Bookmarks } from './bookmarks.model';
import AppError from '../../errors/appError';
import { StatusCodes } from 'http-status-codes';
import Pet from '../pet/pet.model';
import QueryBuilder from '../../builder/QueryBuilder';

// const createBookmarksFromDB = async (petId: string, userId: string) => {
//   if (!userId) {
//     throw new AppError(
//       StatusCodes.UNAUTHORIZED,
//       'You are not authorized! Please login.',
//     );
//   }

//   const pet = await Pet.findById(petId);
//   if (!pet) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
//   }

//   if (pet.isBookmarked) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Pet is already bookmarked');
//   }

//   const payload: IBookmarks = {
//     user_id: new Types.ObjectId(userId),
//     pet_id: new Types.ObjectId(petId),
//     isDeleted: false,
//     isActive: true,
//   };

//   const result = await Bookmarks.create(payload);

//   // update pet isBookmarked
//   await Pet.findOneAndUpdate(
//     { _id: payload.pet_id },
//     { $set: { isBookmarked: true } },
//     { new: true },
//   );

//   return result;
// };

const createBookmarksFromDB = async (petId: string, userId: string) => {
  if (!userId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized! Please login.',
    );
  }

  const pet = await Pet.findById(petId);
  if (!pet) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
  }

  // Check if bookmark already exists
  const existingBookmark = await Bookmarks.findOne({
    user_id: new Types.ObjectId(userId),
    pet_id: new Types.ObjectId(petId),
  });

  if (existingBookmark) {
    // Toggle OFF (remove bookmark)
    await Bookmarks.deleteOne({ _id: existingBookmark._id });

    await Pet.findByIdAndUpdate(petId, { $set: { isBookmarked: false } });
  } else {
    // Toggle ON (add bookmark)
    const payload: IBookmarks = {
      user_id: new Types.ObjectId(userId),
      pet_id: new Types.ObjectId(petId),
      isDeleted: false,
      isActive: true,
    };

    const result = await Bookmarks.create(payload);

    await Pet.findByIdAndUpdate(petId, { $set: { isBookmarked: true } });

    return result;
  }
};

const getAllBookmarksFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const { ...pQuery } = query;
  const baseQuery = Bookmarks.find({ user_id: userId })
    .populate('pet_id')
    .populate('user_id');

  const petsQuery = new QueryBuilder(baseQuery, pQuery)
    .filter()
    .sort()
    .fields();

  const pets = await petsQuery.modelQuery;
  const meta = await petsQuery.countTotal();

  return {
    meta,
    data: pets,
  };
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
