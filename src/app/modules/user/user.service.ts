import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IJwtPayload, IUser } from '../auth/auth.interface';
import User from '../auth/auth.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { IMyPet, IPetAdopt } from './user.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { PetSearchableFields } from '../pet/pet.constant';
import { MyPet, PetAdopt } from './user.model';
import { Types } from 'mongoose';
import Pet from '../pet/pet.model';

const updateProfile = async (
  payload: IUser,
  profile_image: string,
  authUser: IJwtPayload,
) => {
  const isUserExists = await User.findById(authUser._id);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized!');
  }

  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Your account is not active.');
  }

  // Preserve existing hashed password
  payload.password = isUserExists.password;

  const result = await User.findOneAndUpdate(
    { _id: authUser._id },
    { $set: payload, profile_image },
    { new: true, runValidators: true },
  );

  return result;
};

const myProfile = async (authUser: IJwtPayload) => {
  // console.log('authUser', authUser);

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

const deleteUserFromDB = async (authUser: IJwtPayload) => {
  const user = await User.findById(authUser._id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized!');
  }

  if (!user.isActive) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Inactive users cannot be deleted!',
    );
  }

  const deletedUser = await User.findByIdAndDelete(authUser._id);

  return deletedUser;
};

// --------------------------- My Pet Logics ---------------------------
const createMyPetFromDB = async (
  payload: IMyPet,
  image: string,
  authUser: IJwtPayload,
) => {
  const isUserExists = await User.findById(authUser._id);

  if (!isUserExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'You are not authorized! Than you can not create pet.',
    );
  }

  if (!isUserExists.isActive) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Your account is not active. Than you can not create pet.',
    );
  }

  if (!isUserExists.verification?.status) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not verified! Please verify your email address. Check your inbox.',
    );
  }

  payload.owner = new Types.ObjectId(authUser._id);

  const pet = new MyPet({ ...payload, pet_image: image });
  const result = await pet.save();

  return result;
};

const updateMyPetFromDB = async (
  petId: string,
  payload: Partial<IMyPet>,
  image: string,
  authUser: IJwtPayload,
) => {
  // Verify user existence and status
  const isUserExists = await User.findById(authUser._id);

  if (!isUserExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'You are not authorized! Then you cannot update pet.',
    );
  }

  if (!isUserExists.isActive) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Your account is not active. Then you cannot update pet.',
    );
  }

  // Find existing pet by ID
  const existingPet = await MyPet.findById(petId);
  if (!existingPet) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
  }

  // console.log('existingPet', existingPet?.owner.toString());
  // console.log('isUserExists', isUserExists._id.toString());

  // Optional: Check if user owns this pet or has rights to update
  if (
    existingPet?.owner &&
    existingPet.owner.toString() !== isUserExists._id.toString()
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this pet.',
    );
  }
  // Update existing pet with new data
  Object.assign(existingPet, payload, { pet_image: image });
  const updatedPet = await existingPet.save();

  return updatedPet;
};

const getMyAllPetsFromDB = async (query: Record<string, unknown>) => {
  const { ...pQuery } = query;

  const petsQuery = new QueryBuilder(MyPet.find().populate('owner'), pQuery)
    .search(PetSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await petsQuery.modelQuery;
  const meta = await petsQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const getMyPets = async (authUser: IJwtPayload) => {
  console.log('myPet---auth', authUser);

  const pets = await MyPet.find({ owner: authUser._id });
  return pets;
};

const getSinglePet = async (petId: string) => {
  const pet = await MyPet.findById(petId).populate('owner');
  return pet;
};

const deleteSinglePet = async (petId: string) => {
  const pet = await MyPet.findByIdAndDelete(petId);
  return pet;
};

// ---------------- Pet Adopt Service ----------------
const getPetAdoptFromDB = async (authUser: IJwtPayload, payload: IPetAdopt) => {
  const isUserExists = await User.findById(authUser._id);

  if (!isUserExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'You are not authorized! Than you can not create pet.',
    );
  }

  if (!isUserExists.isActive) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Your account is not active. Than you can not create pet.',
    );
  }

  const isAdopted = await Pet.findById(payload.adopted_pet);

  if (isAdopted?.isAdopted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This pet is already adopted.');
  }

  payload.adopter = new Types.ObjectId(authUser._id);

  const result = await PetAdopt.create(payload);

  await Pet.findOneAndUpdate(
    { _id: payload.adopted_pet },
    { $set: { isAdopted: true } },
    { new: true },
  );

  return result;
};

const findAllDonationsFromDB = async () => {
  const donations = await PetAdopt.find()
    .populate('adopter')
    .populate('adopted_pet');
  return donations;
};

export const UserService = {
  updateProfile,
  myProfile,
  changePassword,
  deleteUserFromDB,
  createMyPetFromDB,
  updateMyPetFromDB,
  getMyAllPetsFromDB,
  getMyPets,
  getSinglePet,
  deleteSinglePet,
  getPetAdoptFromDB,
  findAllDonationsFromDB,
};
