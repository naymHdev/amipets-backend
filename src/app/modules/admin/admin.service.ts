import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import {
  IAbout,
  IAddWebsite,
  IBanner,
  IPrivacyPolicy,
  IService,
  ITermsOfService,
} from './admin.interface';
import {
  About,
  AddWebsite,
  Banner,
  PrivacyPolicy,
  Service,
  TermsOfService,
} from './admin.model';
import QueryBuilder from '../../builder/QueryBuilder';
import User from '../auth/auth.model';
import { UserSearchableFields } from './admin.constant';
import { IJwtPayload, IUser } from '../auth/auth.interface';
import mongoose from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import Pet from '../pet/pet.model';
import { orderByPositionAndFill, QueryRecord, ServiceDoc } from './admin.utils';
import { serviceBaseWebOrderByPositionAndFill } from './admin.web.utils';

const createAboutFromDB = async (about: IAbout) => {
  const isExist = await About.findOne({});

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "An 'about' entry already exists in the database. Please update it instead.",
    );
  }

  const result = await About.create(about);
  return result;
};

const getABoutFromDB = async () => {
  const result = await About.findOne();
  return result;
};
const updateAbout = async (about: IAbout) => {
  const result = await About.findOneAndUpdate({}, about, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return result;
};

const createPrivacyPolicyFromDB = async (privacyPolicy: IPrivacyPolicy) => {
  const isExist = await PrivacyPolicy.findOne({});

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'privacy policy' entry already exists in the database. Please update it instead.",
    );
  }

  const result = await PrivacyPolicy.create(privacyPolicy);
  return result;
};

const getPrivacyPolicyFromDB = async () => {
  const result = await PrivacyPolicy.findOne();
  return result;
};

const updatePrivacyPolicy = async (privacyPolicy: IPrivacyPolicy) => {
  const result = await PrivacyPolicy.findOneAndUpdate({}, privacyPolicy, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  return result;
};

const createTermsOfServiceFromDB = async (termsOfService: ITermsOfService) => {
  const isExist = await TermsOfService.findOne({});

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'terms of service' entry already exists in the database. Please update it instead.",
    );
  }

  const result = await TermsOfService.create(termsOfService);
  return result;
};

const getTermsOfServiceFromDB = async () => {
  const result = await TermsOfService.findOne();
  return result;
};

const updateTermsOfService = async (termsOfService: ITermsOfService) => {
  const result = await TermsOfService.findOneAndUpdate({}, termsOfService, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return result;
};

// ---------------------------- Banner Service ----------------------------
const createBannerFromDB = async (
  payload: { title: string; description: string; websiteLink: string[] },
  images: string[],
) => {
  // Create new bannerInfo entries based on the payload and images
  const newBannerInfo = payload.websiteLink.map((link, index) => ({
    image: images?.[index] || '',
    websiteLink: link,
  }));

  // Check if a banner already exists in the database
  const isExist = await Banner.findOne({});

  let result;
  if (isExist) {
    // If a banner exists, append new bannerInfo to the existing banner
    const mergedBannerInfo = [...isExist.bannerInfo, ...newBannerInfo];

    result = await Banner.findOneAndUpdate(
      {},
      {
        banner: payload.title || 'banner',
        bannerInfo: mergedBannerInfo,
      },
      { new: true },
    );
  } else {
    // If no banner exists, create a new one
    const banner = new Banner({
      banner: payload.title || 'banner',
      bannerInfo: newBannerInfo,
    });

    result = await banner.save();
  }

  return result;
};

const getBannerFromDB = async () => {
  const result = await Banner.findOne();
  return result;
};

const updateBanner = async (
  payload: Partial<IBanner>,
  images: string[],
  id: string,
) => {
  // console.log('images___[]', images);
  const isExist = await Banner.findOne({ 'bannerInfo._id': id });

  if (!isExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Banner info entry does not exist.',
    );
  }

  // Build the new data for this single bannerInfo entry
  const updatedInfo: any = {
    ...payload.bannerInfo?.[0],
  };

  if (images && images.length > 0) {
    updatedInfo.image = images[0];
  }

  // Update a single bannerInfo object inside the array
  const result = await Banner.findOneAndUpdate(
    { 'bannerInfo._id': new mongoose.Types.ObjectId(id) },
    {
      $set: {
        'bannerInfo.$.websiteLink': updatedInfo.websiteLink,
        ...(updatedInfo.image && { 'bannerInfo.$.image': updatedInfo.image }),
      },
    },
    { new: true },
  );

  return result;
};

const deleteSingleBannerInfo = async (infoId: string) => {
  const result = await Banner.findOneAndUpdate(
    {}, // match the single banner document
    { $pull: { bannerInfo: { _id: new mongoose.Types.ObjectId(infoId) } } },
    { new: true },
  );

  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'No banner found or banner info does not exist',
    );
  }

  return result;
};

// ---------------------------- Services Service ----------------------------
const createServiceFromDB = async (payload: IService, icon: string) => {
  const existsService = await Service.findOne({ name: payload.name });

  if (existsService) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'service' entry already exists in the database. Please update it instead.",
    );
  }

  const result = await Service.create({ ...payload, icon });
  return result;
};

const getServiceFromDB = async (query: QueryRecord): Promise<ServiceDoc[]> => {
  const { ...wQuery } = query;

  const baseQuery = Service.find();
  const serviceQuery = new QueryBuilder(baseQuery, wQuery)
    .search(['name', 'service_tags'])
    .filter()
    .sort()
    .fields();

  const services = await serviceQuery.modelQuery.lean<ServiceDoc[]>();

  // Use the pure function above (type safe)
  return orderByPositionAndFill(services);
};
const getSingleServices = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

const updateService = async (
  id: string,
  payload: IService,
  icon: string | undefined,
) => {
  const existsService = await Service.findById(id);

  if (!existsService) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'service' entry does not exist in the database. Please create it first.",
    );
  }

  const result = await Service.findOneAndUpdate(
    { _id: id },
    { ...payload, icon },
    { new: true },
  );
  return result;
};

const deleteService = async (id: string) => {
  const result = await Service.findByIdAndDelete(id);
  return result;
};

// ---------------------------- Add website Service ----------------------------

const createWebsiteFromDB = async (
  payload: IAddWebsite,
  web_img: string,
  serviceName: string,
) => {
  const result = await AddWebsite.create({
    ...payload,
    web_img,
    serviceName: serviceName,
  });
  return result;
};

const updateWebFromDB = async (
  id: string,
  payload: IAddWebsite,
  web_img: string,
) => {
  const existsWebsite = await AddWebsite.findById(id);

  if (!existsWebsite) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'website' entry does not exist in the database. Please create it first.",
    );
  }

  const finalImg = web_img || existsWebsite.web_img;

  const updatedData = {
    ...payload,
    web_img: finalImg,
  };

  const result = await AddWebsite.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });
  return result;
};

const getWebsiteFromDB = async (query: Record<string, unknown>) => {
  const { pet_type, ...wQuery } = query;

  // Adjust the pet_type logic
  let petTypeFilter = {};

  if (pet_type) {
    if (pet_type === 'cat') {
      petTypeFilter = { pet_type: { $in: ['cat', 'both'] } };
    } else if (pet_type === 'dog') {
      petTypeFilter = { pet_type: { $in: ['dog', 'both'] } };
    } else if (pet_type === 'both') {
      petTypeFilter = {};
    }
  }

  const websiteQuery = new QueryBuilder(
    AddWebsite.find(petTypeFilter).populate('service'),
    wQuery,
  )
    .search(['web_name', 'web_link', 'location', 'pet_type'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await websiteQuery.modelQuery;
  const meta = await websiteQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const getWebDetailFromDB = async (id: string) => {
  const result = await AddWebsite.findById(id).populate('service');
  return result;
};

const deleteWebsite = async (id: string) => {
  const result = await AddWebsite.findByIdAndDelete(id);
  return result;
};

const getServiceBaseWeb = async (
  serviceId: string,
  query: Record<string, unknown>,
) => {
  const { pet_type, ...wQuery } = query;

  // Adjust the pet_type logic
  let petTypeFilter = {};

  if (pet_type) {
    if (pet_type === 'cat') {
      petTypeFilter = { pet_type: { $in: ['cat', 'both'] } };
    } else if (pet_type === 'dog') {
      petTypeFilter = { pet_type: { $in: ['dog', 'both'] } };
    } else if (pet_type === 'both') {
      petTypeFilter = {};
    }
  }

  const baseQuery = AddWebsite.find({
    service: serviceId,
    ...petTypeFilter,
  });
  const websiteQuery = new QueryBuilder(baseQuery, wQuery)
    .search(['web_name', 'pet_type', 'serviceName', 'service_tags'])
    .sort()
    .fields()
    .filter();

  const result = await websiteQuery.modelQuery.lean<ServiceDoc[]>();

  return serviceBaseWebOrderByPositionAndFill(result);
};

const updateServiceBaseWebPosition = async (
  id: string,
  position: number | null,
) => {
  const websites = await AddWebsite.findById(id);

  if (!websites) {
    throw new AppError(StatusCodes.NOT_FOUND, 'websites not found');
  }

  if (position === null || position === undefined) {
    const result = await AddWebsite.findByIdAndUpdate(
      id,
      { $set: { position: null } },
      { new: true },
    );
    return result;
  }

  if (!Number.isInteger(position) || position <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Position must be a positive integer',
    );
  }

  if (websites.position === position) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'The same position is already set for this website base service',
    );
  }

  const positionTaken = await AddWebsite.findOne({
    position: position,
    service: websites?.service,
    _id: { $ne: id },
  });

  if (positionTaken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Position ${position} is already assigned to another website Name: ${positionTaken.web_name}`,
    );
  }

  // 6. Total count validation (optional)
  const totalWebServices = await AddWebsite.countDocuments();
  if (position > totalWebServices) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Position cannot exceed total website count (${totalWebServices})`,
    );
  }

  // 7. Update web base service position
  const result = await AddWebsite.findByIdAndUpdate(
    id,
    { $set: { position } },
    { new: true, runValidators: true },
  );

  return result;
};

const getWebLocations = async (id: string) => {
  // 1️⃣ Find the service by ID
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Service not found');
  }

  // 2️⃣ Aggregate locations for websites that have the same service name
  const locations = await AddWebsite.aggregate([
    {
      $lookup: {
        from: 'services',
        localField: 'service',
        foreignField: '_id',
        as: 'serviceData',
      },
    },
    { $unwind: '$serviceData' },
    { $match: { 'serviceData.name': service.name } },
    { $group: { _id: null, locations: { $addToSet: '$location' } } },
    { $project: { _id: 0, locations: 1 } },
  ]);

  return locations[0]?.locations || [];
};

// ---------------------------- Users Service ----------------------------
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const { ...uQuery } = query;

  const usersQuery = new QueryBuilder(
    User.find({ role: { $ne: 'admin' }, isDeleted: false }),
    uQuery,
  )
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const getUserDetailFromDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  return result;
};

const blockUser = async (id: string, userID: any) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  await User.findByIdAndUpdate(id, { isActive: false });

  if (user?.role == 'shelter') {
    //disable all pets
    await Pet.updateMany({ owner: id }, { isVisible: false });
  }

  await NotificationService.sendNotification({
    ownerId: userID,
    key: 'notification',
    data: {
      id: null,
      message: ` ${user?.first_name} ${user?.last_name} your account blocked ❌`,
    },
    receiverId: [user?._id as any],
    notifyAdmin: false,
  });
};

const unblockUser = async (id: string, userID: any) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  await User.findByIdAndUpdate(id, { isActive: true });

  if (user?.role == 'shelter') {
    //active all pets
    await Pet.updateMany({ owner: id }, { isVisible: true });
  }

  await NotificationService.sendNotification({
    ownerId: userID,
    key: 'notification',
    data: {
      id: null,
      message: ` ${user?.first_name} ${user?.last_name} your account unblocked ✅`,
    },
    receiverId: [user?._id as any],
    notifyAdmin: false,
  });
};

const updateServicePosition = async (id: string, position: number | null) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Service not found');
  }

  if (position === null || position === undefined) {
    const result = await Service.findByIdAndUpdate(
      id,
      { $set: { position: null } },
      { new: true },
    );
    return result;
  }

  if (!Number.isInteger(position) || position <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Position must be a positive integer',
    );
  }

  if (service.position === position) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Position is already set');
  }

  const positionTaken = await Service.findOne({
    position: position,
    _id: { $ne: id },
  });

  if (positionTaken) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Position ${position} is already assigned to another service`,
    );
  }

  // 6. Total count validation (optional)
  const totalServices = await Service.countDocuments();
  if (position > totalServices) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Position cannot exceed total service count (${totalServices})`,
    );
  }

  // 7. Update service position
  const result = await Service.findByIdAndUpdate(
    id,
    { $set: { position } },
    { new: true, runValidators: true },
  );

  return result;
};

// --------------------------- Shelter Services ---------------------------
const getAllSheltersFromDB = async (query: Record<string, unknown>) => {
  const { ...sQuery } = query;
  const baseQuery = User.find({ role: 'shelter', isDeleted: false });

  const sheltersQuery = new QueryBuilder(baseQuery, sQuery)
    .search(['gender', 'email', 'first_name', 'last_name', 'location'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await sheltersQuery.modelQuery;
  const meta = await sheltersQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

const shelterDetailFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const blockShelter = async (id: string, userID: any) => {
  const shelter = await User.findById(id);
  if (!shelter) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Shelter not found');
  }
  shelter.isActive = false;
  await shelter.save();

  //disable all pets
  await Pet.updateMany({ owner: id }, { isVisible: false });

  await NotificationService.sendNotification({
    ownerId: userID,
    key: 'notification',
    data: {
      id: null,
      message: ` ${shelter?.first_name} ${shelter?.last_name} your account blocked`,
    },
    receiverId: [shelter?._id as any],
    notifyAdmin: false,
  });
};

const deleteShelter = async (id: string, userID: any) => {
  const shelter = await User.findById(id);
  if (!shelter) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Shelter not found');
  }
  shelter.isDeleted = true;
  await shelter.save();

  //disable all pets
  await Pet.updateMany({ owner: id }, { isVisible: false });

  await NotificationService.sendNotification({
    ownerId: userID,
    key: 'notification',
    data: {
      id: null,
      message: ` ${shelter?.first_name} ${shelter?.last_name} your account is deleted`,
    },
    receiverId: [shelter?._id as any],
    notifyAdmin: false,
  });
};

// --------------------------- Admin Profile Service ---------------------------

const adminProfile = async (authUser: IJwtPayload) => {
  const isUserExists = await User.findById(authUser._id);
  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found');
  }
  if (!isUserExists.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Admin is not active');
  }

  return {
    ...isUserExists.toObject(),
  };
};
const editProfileFromDB = async (
  authUser: IJwtPayload,
  payload: IUser,
  profile_image: string,
) => {
  const isUserExists = await User.findById(authUser._id);
  // console.log('isUserExists admin', isUserExists);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found');
  }

  // Get current profile image from DB
  const existUser = await User.findById(authUser._id).select('profile_image');

  // If new image is not provided, keep existing one
  const finalProfileImage =
    profile_image && profile_image !== ''
      ? profile_image
      : existUser?.profile_image || '';

  const result = await User.findOneAndUpdate(
    { _id: authUser._id },
    { ...payload, profile_image: finalProfileImage },
    { new: true },
  );
  return result;
};

const deleteUser = async (email: string) => {
  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email is required.');
  }

  const result = await User.deleteOne({ email });
  return result;
};

export const AdminService = {
  createAboutFromDB,
  createPrivacyPolicyFromDB,
  createTermsOfServiceFromDB,
  getABoutFromDB,
  getPrivacyPolicyFromDB,
  getTermsOfServiceFromDB,
  updateAbout,
  updatePrivacyPolicy,
  updateTermsOfService,

  createBannerFromDB,
  getBannerFromDB,
  updateBanner,
  deleteSingleBannerInfo,

  createServiceFromDB,
  getServiceFromDB,
  getSingleServices,
  updateService,
  deleteService,
  getServiceBaseWeb,
  getWebLocations,
  updateServicePosition,

  createWebsiteFromDB,
  getWebsiteFromDB,
  deleteWebsite,
  getWebDetailFromDB,
  updateServiceBaseWebPosition,
  updateWebFromDB,

  getAllUsersFromDB,
  getUserDetailFromDB,
  blockUser,
  unblockUser,
  editProfileFromDB,
  adminProfile,
  deleteUser,

  getAllSheltersFromDB,
  shelterDetailFromDB,
  blockShelter,
  deleteShelter,
};
