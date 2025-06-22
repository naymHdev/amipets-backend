import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import {
  IAbout,
  IBanner,
  IPrivacyPolicy,
  IService,
  ITermsOfService,
} from './admin.interface';
import {
  About,
  Banner,
  PrivacyPolicy,
  Services,
  TermsOfService,
} from './admin.model';

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
  const existsService = await Services.findOne({ name: payload.name });

  if (existsService) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'service' entry already exists in the database. Please update it instead.",
    );
  }

  const result = await Services.create({ ...payload, icon });
  return result;
};

const getServiceFromDB = async () => {
  const result = await Services.find();
  return result;
};
const updateService = async (id: string, payload: IService, icon: string) => {
  const existsService = await Services.findById(id);

  if (!existsService) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A 'service' entry does not exist in the database. Please create it first.",
    );
  }

  const result = await Services.findOneAndUpdate(
    { _id: id },
    { ...payload, icon },
    { new: true },
  );
  return result;
};

const deleteService = async (id: string) => {
  const result = await Services.findByIdAndDelete(id);
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
};
