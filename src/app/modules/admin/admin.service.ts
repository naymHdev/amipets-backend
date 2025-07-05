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
const createBannerFromDB = async (payload: IBanner, image: string) => {
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

const updateBanner = async (payload: IBanner, image: string) => {
  const isExist = await Banner.findOne({});

  if (!isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'banner' entry does not exist in the database. Please create it first.",
    );
  }

  const result = await Banner.findOneAndUpdate(
    {},
    { ...payload, image },
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

const getServiceFromDB = async () => {
  const result = await Service.find();
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

const getWebsiteFromDB = async (query: Record<string, unknown>) => {
  const { ...wQuery } = query;

  const websiteQuery = new QueryBuilder(AddWebsite.find(), wQuery)
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
  const result = await AddWebsite.findById(id);
  return result;
};

const deleteWebsite = async (id: string) => {
  const result = await AddWebsite.findByIdAndDelete(id);
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

// --------------------------- Shelter Services ---------------------------
const getAllSheltersFromDB = async () => {
  const result = await User.find({ role: 'shelter' });
  return result;
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
  console.log('isUserExists admin', isUserExists);

  if (!isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found');
  }
  const result = await User.findOneAndUpdate(
    { _id: authUser._id },
    { ...payload, profile_image },
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
  updateService,
  deleteService,
  createWebsiteFromDB,
  getWebsiteFromDB,
  deleteWebsite,
  getWebDetailFromDB,

  getAllUsersFromDB,
  getUserDetailFromDB,
  blockUser,
  editProfileFromDB,
  adminProfile,

  getAllSheltersFromDB,
  shelterDetailFromDB,
  blockShelter,
};
