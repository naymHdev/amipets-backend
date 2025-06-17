import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IJwtPayload, IUser } from '../auth/auth.interface';
import User from '../auth/auth.model';
import { IImageFile } from '../../interface/IImageFile';
import { Document } from 'mongoose';

const updateProfile = async (
  payload: IUser,
  file: IImageFile,
  authUser: IJwtPayload,
) => {
  // Fetch the current user
  const isUserExists = await User.findById(authUser._id);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
  }

  if (file && file.path) {
    payload.profile_image = file.path;
  }

  // Merge existing address with new address data
  if (payload.location) {
    const existingLocation =
      (isUserExists.location as unknown as Document)?.toObject() || {};
    payload.location = {
      ...existingLocation,
      ...payload.location,
    };
  }

  const result = await User.findOneAndUpdate(
    { _id: authUser._id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};

export const UserService = {
  updateProfile,
};
