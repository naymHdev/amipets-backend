import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';
import config from '../../config';

const createAbout = catchAsync(async (req, res) => {
  const result = await AdminService.createAboutFromDB(req.body);

  sendResponse(res, {
    success: true,
    message: 'About section created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getAbout = catchAsync(async (req, res) => {
  const result = await AdminService.getABoutFromDB();

  sendResponse(res, {
    success: true,
    message: 'About section fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateAbout = catchAsync(async (req, res) => {
  const result = await AdminService.updateAbout(req.body);

  sendResponse(res, {
    success: true,
    message: 'About section updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await AdminService.createPrivacyPolicyFromDB(req.body);

  sendResponse(res, {
    success: true,
    message: 'Privacy policy created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await AdminService.getPrivacyPolicyFromDB();

  sendResponse(res, {
    success: true,
    message: 'Privacy policy fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updatePrivacyPolicy = catchAsync(async (req, res) => {
  const result = await AdminService.updatePrivacyPolicy(req.body);

  sendResponse(res, {
    success: true,
    message: 'Privacy policy updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const createTermsAndCondition = catchAsync(async (req, res) => {
  const result = await AdminService.createTermsOfServiceFromDB(req.body);

  sendResponse(res, {
    success: true,
    message: 'Terms and condition created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getTermsAndCondition = catchAsync(async (req, res) => {
  const result = await AdminService.getTermsOfServiceFromDB();

  sendResponse(res, {
    success: true,
    message: 'Terms and condition fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateTermsAndCondition = catchAsync(async (req, res) => {
  const result = await AdminService.updateTermsOfService(req.body);

  sendResponse(res, {
    success: true,
    message: 'Terms and condition updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

// --------------------------------- Banner Controller ---------------------------------
const createBanner = catchAsync(async (req, res) => {
  const payload = req.body;
  const image =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';
  const result = await AdminService.createBannerFromDB(payload, image);

  sendResponse(res, {
    success: true,
    message: 'Banner created successfully',
    statusCode: StatusCodes.CREATED,
    data: result,
  });
});

const getBanner = catchAsync(async (req, res) => {
  const result = await AdminService.getBannerFromDB();

  sendResponse(res, {
    success: true,
    message: 'Banner fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const updateBanner = catchAsync(async (req, res) => {
  const payload = req.body;
  const image =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';
  const result = await AdminService.updateBanner(payload, image);

  sendResponse(res, {
    success: true,
    message: 'Banner updated successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const AdminController = {
  createAbout,
  createPrivacyPolicy,
  createTermsAndCondition,
  getAbout,
  getPrivacyPolicy,
  getTermsAndCondition,
  updateAbout,
  updatePrivacyPolicy,
  updateTermsAndCondition,
  createBanner,
  getBanner,
  updateBanner,
};
