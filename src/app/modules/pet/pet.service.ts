import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IJwtPayload } from '../auth/auth.interface';
import User from '../auth/auth.model';
import { IPet } from './pet.interface';
import Pet from './pet.model';
import QueryBuilder from '../../builder/QueryBuilder';
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

  if (payload.pet_status === 'adopted') {
    payload.adoptedDate = new Date();
  } else {
    payload.adoptedDate = null;
  }

  payload.owner = new Types.ObjectId(authUser._id);

  const pet = new Pet({
    ...payload,
    pet_image: image,
  });
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

  // Handle image update → append new images to existing ones
  let finalProfileImages = existingPet.pet_image || [];
  if (image && image?.length > 0) {
    finalProfileImages = [...finalProfileImages, ...image];
  }

  let finalReports = existingPet.pet_reports || [];
  if (payload.pet_reports && payload.pet_reports?.length > 0) {
    finalReports = [...finalReports, ...payload.pet_reports];
  }

  // --------- Update pet with new data ---------
  if (payload.pet_status === 'adopted') {
    payload.adoptedDate = new Date();
  } else {
    payload.adoptedDate = null;
  }

  // Update existing pet with new data
  Object.assign(existingPet, payload, {
    pet_image: finalProfileImages,
    pet_reports: finalReports,
  });
  const updatedPet = await existingPet.save();

  return updatedPet;
};

const deletedPetImg = async (petId: string, img: string) => {
  const pet = await Pet.findById(petId);
  if (!pet) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
  }

  const newPet = await Pet.findByIdAndUpdate(
    petId,
    { $pull: { pet_image: img } },
    { new: true },
  );

  return newPet;
};

const deletedPetReport = async (petId: string, report: string) => {
  const pet = await Pet.findById(petId);
  if (!pet) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Pet not found');
  }

  if (!pet.pet_reports?.includes(report)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Payload report are not found');
  }

  const newPet = await Pet.findByIdAndUpdate(
    petId,
    { $pull: { pet_reports: report } },
    { new: true },
  );

  return newPet;
};

const getAllPetsFromDB = async (query: Record<string, unknown>) => {
  const {
    latitude,
    longitude,
    page: pageStr,
    limit: limitStr,
    searchTerm,
    ageGroup,
    ...filters
  } = query;

  // Convert latitude and longitude to numbers (if they are strings)
  const lat = parseFloat(latitude as string);
  const lon = parseFloat(longitude as string);
  const page = parseInt(pageStr as string) || 1;
  const limit = parseInt(limitStr as string) || 10;
  const skip = (page - 1) * limit;

  const now = new Date();
  const geoQuery: any = { isVisible: true };

  // ----------------- AGE FILTER LOGIC -----------------
  if (query.ageGroup) {
    const now = new Date();

    let ageFilter: any = {};

    if (query.ageGroup === 'upto2') {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      ageFilter.date_of_birth = { $gte: twoYearsAgo };
    }

    if (query.ageGroup === '2to7') {
      const twoYearsAgo = new Date();
      const sevenYearsAgo = new Date();
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      sevenYearsAgo.setFullYear(now.getFullYear() - 7);
      ageFilter.date_of_birth = { $gte: sevenYearsAgo, $lte: twoYearsAgo };
    }

    if (query.ageGroup === 'over7') {
      const sevenYearsAgo = new Date();
      sevenYearsAgo.setFullYear(now.getFullYear() - 7);
      ageFilter.date_of_birth = { $lte: sevenYearsAgo };
    }

    // Merge ageFilter into existing filters object
    Object.assign(filters, ageFilter);
  }

  filters.isVisible = true;

  const pipeline: any[] = [];

  // GEO SEARCH
  if (lat && lon) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        key: 'location',
        distanceField: 'dist.calculated',
        spherical: true,
        maxDistance: 50 * 1609.34,
        query: geoQuery,
      },
    });
  } else {
    pipeline.push({
      $match: {
        ...filters,
      },
    });
  }

  // SEARCH TERM
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { full_name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          {
            pet_category: { $regex: searchTerm, $options: 'i' },
          },
        ],
      },
    });
  }

  // ADDITIONAL FILTERS
  if (Object.keys(filters)?.length > 0) {
    pipeline.push({ $match: filters });
  }

  // SORT + PAGINATION
  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $skip: skip });

  // ✅ RANDOMIZE ORDER
  pipeline.push({ $sample: { size: limit } });

  // RUN AGGREGATION
  const results = await Pet.collection.aggregate(pipeline).toArray();

  // ✅ COUNT total matching documents (without sampling)
  const countPipeline: any[] = [];

  if (lat && lon) {
    countPipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        key: 'location',
        distanceField: 'dist.calculated',
        spherical: true,
        maxDistance: 50 * 1609.34,
        query: geoQuery,
      },
    });
  } else {
    countPipeline.push({
      $match: {
        ...filters,
      },
    });
  }

  if (searchTerm) {
    countPipeline.push({
      $match: {
        $or: [
          { full_name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { pet_category: { $regex: searchTerm, $options: 'i' } },
        ],
      },
    });
  }

  if (Object.keys(filters)?.length > 0) {
    countPipeline.push({ $match: filters });
  }

  countPipeline.push({ $count: 'total' });

  const countResult = await Pet.collection.aggregate(countPipeline).toArray();
  const totalData = countResult[0]?.total || 0;
  const totalPages = Math.ceil(totalData / limit);

  return { page, limit, totalPages, totalData, results };
};

const getMyPets = async (
  authUser: IJwtPayload,
  query: Record<string, unknown>,
) => {
  const { ...filters } = query;

  const baseQuery = Pet.find({ owner: authUser._id, isVisible: true });

  const petsQuery = new QueryBuilder(baseQuery, filters)
    .search(['full_name', 'location', 'breed', 'pet_category', 'gender'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const pets = await petsQuery.modelQuery;
  const meta = await petsQuery.countTotal();

  return {
    meta,
    data: pets,
  };
};

const getSinglePet = async (petId: string) => {
  const pet = await Pet.findOne({ _id: petId, isVisible: true }).populate(
    'owner',
  );
  return pet;
};

const deleteSinglePet = async (petId: string) => {
  const pet = await Pet.findByIdAndDelete(petId);
  return pet;
};

const findPetBreads = async () => {
  const pet = await Pet.distinct('breed');
  return pet;
};
const findLocations = async () => {
  const pet = await Pet.distinct('location');
  return pet;
};

const findCities = async () => {
  const pet = await Pet.distinct('city');
  return pet;
};

export const PetServices = {
  createPerFromDB,
  updatePetFromDB,
  getAllPetsFromDB,
  getMyPets,
  getSinglePet,
  deleteSinglePet,

  deletedPetImg,
  deletedPetReport,

  findPetBreads,
  findLocations,
  findCities,
};
