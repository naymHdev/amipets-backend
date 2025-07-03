import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import User from '../auth/auth.model';
import { IPet } from './pet.interface';
import Pet from './pet.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { PetSearchableFields } from './pet.constant';
import { Types } from 'mongoose';

const createPerFromDB = async (
  payload: IPet,
  image: string[],
  authUser: IJwtPayload,
) => {
  const isUserExists = await User.findById(authUser._id);

  if (isUserExists?.role !== 'shelter') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You are not authorized! Than you can not create pet.',
    );
  }

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

  const pet = new Pet({ ...payload, pet_image: image });
  const result = await pet.save();

  return result;
};

const updatePetFromDB = async (
  petId: string,
  payload: Partial<IPet>,
  image: string[],
  authUser: IJwtPayload,
) => {
  // Verify user existence and status
  const isUserExists = await User.findById(authUser._id);

  if (isUserExists?.role !== 'shelter') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'You are not authorized! Then you cannot update pet.',
    );
  }

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
  const existingPet = await Pet.findById(petId);
  if (!existingPet) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
  }

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

const getAllPetsFromDB = async (query: Record<string, unknown>) => {
  const { ...pQuery } = query;

  const petsQuery = new QueryBuilder(Pet.find().populate('owner'), pQuery)
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
  const pets = await Pet.find({ owner: authUser._id });
  return pets;
};

const getSinglePet = async (petId: string) => {
  const pet = await Pet.findById(petId).populate('owner');
  return pet;
};

const deleteSinglePet = async (petId: string) => {
  const pet = await Pet.findByIdAndDelete(petId);
  return pet;
};

export const PetServices = {
  createPerFromDB,
  updatePetFromDB,
  getAllPetsFromDB,
  getMyPets,
  getSinglePet,
  deleteSinglePet,
};
