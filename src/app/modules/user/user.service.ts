import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IJwtPayload, IUser } from '../auth/auth.interface';
import User from '../auth/auth.model';
import { IImageFile } from '../../interface/IImageFile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

const updateProfile = async (
  payload: IUser,
  file: IImageFile,
  authUser: IJwtPayload,
) => {
  // Fetch the current user
  const isUserExists = await User.findById(authUser._id);
  // console.log('isUserExists', isUserExists);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized!');
  }

  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Your account is not active.');
  }

  // Preserve existing hashed password
  payload.password = isUserExists.password;

  if (file && file.path) {
    payload.profile_image = file.path;
  }

  const result = await User.findOneAndUpdate(
    { _id: authUser._id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};

const myProfile = async (authUser: IJwtPayload) => {
  console.log('authUser', authUser);

  const isUserExists = await User.findById(authUser._id).populate('_id');
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }
  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not active!');
  }

  return {
    ...isUserExists.toObject(),
  };
};

const changePassword = async (
  token: string,
  payload: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  },
) => {
  // Decode user from token
  const decoded = jwt.verify(token, config.jwt_access_secret as string) as {
    _id: string;
  };

  // Fetch user with password
  const user = await User.findById(decoded._id).select('+password');
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // Check current password
  const isMatch = await bcrypt.compare(payload.current_password, user.password);
  if (!isMatch) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Current password is incorrect',
    );
  }

  // Confirm new passwords match
  if (payload.new_password !== payload.confirm_password) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'New passwords do not match');
  }

  // Set and save new password (this triggers pre-save hashing)
  user.password = payload.new_password;
  await user.save(); // pre('save') will hash this

  return {
    success: true,
    message: 'Password updated and hashed successfully',
  };
};

export const UserService = {
  updateProfile,
  myProfile,
  changePassword,
};
