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
  const result = await About.findOneAndUpdate({}, about, { new: true });
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
  });
  return result;
};

// ---------------------------- Banner Service ----------------------------
const createBannerFromDB = async (payload: IBanner, image: string[]) => {
  const isExist = await Banner.findOne({});

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'banner' entry already exists in the database. Please update it instead.",
    );
  }

  const banner = new Banner({ ...payload, image });
  const result = await banner.save();
  return result;
};

const getBannerFromDB = async () => {
  const result = await Banner.findOne();
  return result;
};

const updateBanner = async (
  payload: IBanner,
  image: string[],
  banner: string,
) => {
  const isExist = await Banner.findOne({});

  if (!isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'banner' entry does not exist in the database. Please create it first.",
    );
  }

  const finalImg = image || isExist.image;

  const result = await Banner.findOneAndUpdate(
    {},
    { ...payload, image: finalImg, banner },
    {
      new: true,
    },
  );
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

const getServiceFromDB = async (query: Record<string, unknown>) => {
  const { ...wQuery } = query;
  const baseQuery = Service.find();

  const serviceQuery = new QueryBuilder(baseQuery, wQuery).search(['name']);

  const result = await serviceQuery.modelQuery;
  return result;
};

const getSingleServices = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

const updateService = async (id: string, payload: IService, icon: string) => {
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
  const { ...wQuery } = query;

  const websiteQuery = new QueryBuilder(
    AddWebsite.find().populate('service'),
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
  console.log('query', query);

  const { ...wQuery } = query;
  const baseQuery = AddWebsite.find({ service: serviceId });

  const websiteQuery = new QueryBuilder(baseQuery, wQuery)
    .sort()
    .fields()
    .filter();

  const result = await websiteQuery.modelQuery.sort({ position: 1 });
  return result;
};

const swapPosition = async (pos1: number | string, pos2: number | string) => {
  const position1 = Number(pos1);
  const position2 = Number(pos2);

  const website1 = await AddWebsite.findOne({ position: position1 });
  const website2 = await AddWebsite.findOne({ position: position2 });

  if (!website1 || !website2) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'One or both positions not found',
    );
  }

  await AddWebsite.findByIdAndUpdate(website1._id, { position: position2 });
  await AddWebsite.findByIdAndUpdate(website2._id, { position: position1 });

  return {
    message: 'Positions swapped',
    website1: website1._id,
    website2: website2._id,
  };
};

const getWebLocations = async () => {
  const result = await AddWebsite.distinct('location');
  return result;
};

// ---------------------------- Users Service ----------------------------
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const { ...uQuery } = query;

  const usersQuery = new QueryBuilder(User.find(), uQuery)
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

const blockUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  user.isActive = false;
  await user.save();
};

const unblockUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }
  user.isActive = true;
  await user.save();
};

// --------------------------- Shelter Services ---------------------------
const getAllSheltersFromDB = async (query: Record<string, unknown>) => {
  const { ...sQuery } = query;
  const baseQuery = User.find({ role: 'shelter' });

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

const blockShelter = async (id: string) => {
  const shelter = await User.findById(id);
  if (!shelter) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Shelter not found');
  }
  shelter.isActive = false;
  await shelter.save();
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

  createServiceFromDB,
  getServiceFromDB,
  getSingleServices,
  updateService,
  deleteService,
  getServiceBaseWeb,
  getWebLocations,

  createWebsiteFromDB,
  getWebsiteFromDB,
  deleteWebsite,
  getWebDetailFromDB,
  swapPosition,
  updateWebFromDB,

  getAllUsersFromDB,
  getUserDetailFromDB,
  blockUser,
  unblockUser,
  editProfileFromDB,
  adminProfile,

  getAllSheltersFromDB,
  shelterDetailFromDB,
  blockShelter,
};
