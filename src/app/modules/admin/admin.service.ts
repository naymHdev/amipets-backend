import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IAbout, IPrivacyPolicy, ITermsOfService } from './admin.interface';
import { About, PrivacyPolicy, TermsOfService } from './admin.model';

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
};
