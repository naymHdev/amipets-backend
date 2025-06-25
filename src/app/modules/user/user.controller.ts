import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';
import config from '../../config';

const updateProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateProfile(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload,
  );
  // console.log('updateProfile result', result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your profile updated successfully!',
    data: result,
  });
});

const myProfile = catchAsync(async (req, res) => {
  // console.log('req.user', req.user);

  const isUser = req.user as IJwtPayload;
  const result = await UserService.myProfile(isUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await UserService.changePassword(
    req?.headers?.authorization as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your password changed successfully',
    data: result,
  });
});

const deleteProfile = catchAsync(async (req, res) => {
  const isUser = req.user as IJwtPayload;

  const result = await UserService.deleteUserFromDB(isUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Profile deleted successfully`,
    data: result,
  });
});

// ------------------------  My Pet Controller ------------------------
const createMyPet = catchAsync(async (req, res) => {
  const pet_img =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';

  const result = await UserService.createMyPetFromDB(
    req.body,
    pet_img,
    req.user as IJwtPayload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pet created successfully!',
    data: result,
  });
});

const updateMyPet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const payload = req.body;
  const pet_img =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';
  const authUser = req.user as IJwtPayload;

  const result = await UserService.updateMyPetFromDB(
    petId,
    payload,
    pet_img,
    authUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pet updated successfully!',
    data: result,
  });
});

const getMyPets = catchAsync(async (req, res) => {
  const result = await UserService.getMyPets(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pets fetched successfully!',
    data: result,
  });
});

const getMyAllPet = catchAsync(async (req, res) => {
  const result = await UserService.getMyAllPetsFromDB(req.query);
  // console.log('result', result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pets fetched successfully!',
    data: result,
  });
});

const getMySinglePet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const result = await UserService.getSinglePet(petId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet fetched successfully!',
    data: result,
  });
});

const deleteMyPet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const result = await UserService.deleteSinglePet(petId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet deleted successfully!',
    data: result,
  });
});

// ------------------------  Get Pet Adopt Controller ------------------------
const getPetAdopt = catchAsync(async (req, res) => {
  // console.log('adopt', req.body);
  const result = await UserService.getPetAdoptFromDB(
    req.user as IJwtPayload,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet adopted successfully!',
    data: result,
  });
});

export const UserController = {
  updateProfile,
  myProfile,
  changePassword,
  deleteProfile,
  createMyPet,
  updateMyPet,
  getMyPets,
  getMyAllPet,
  getMySinglePet,
  deleteMyPet,
  getPetAdopt,
};
