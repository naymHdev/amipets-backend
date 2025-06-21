import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';

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

export const AdminController = {
  createAbout,
  createPrivacyPolicy,
  createTermsAndCondition,
  getAbout,
  getPrivacyPolicy,
  getTermsAndCondition,
};
