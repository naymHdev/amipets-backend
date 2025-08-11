import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import config from '../../config';
import { NotificationService } from '../notification/notification.service';

const updateProfile = catchAsync(async (req, res) => {
  const profile_image =
    (req.file?.filename && config.BASE_URL + '/images/' + req.file.filename) ||
    '';

  const result = await UserService.updateProfile(
    req.body,
    profile_image,
    req.user as IJwtPayload,
  );

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${result?.full_name} updated successfully!`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your profile updated successfully!',
    data: result,
  });
});

const myProfile = catchAsync(async (req, res) => {
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

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: ` ${req.user?.firstName} ${req.user?.lastName} changed password`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

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

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `Your profile deleted successfully!`,
    },
    receiverId: [req.user?._id],
    notifyUser: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.firstName} ${req.user?.lastName} deleted profile`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

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

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${result?.full_name} Your pet created successfully!`,
    },
    receiverId: [req.user?._id],
    notifyUser: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} created pet`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

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

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `Pet ${result?.full_name} updated successfully!`,
    },
    receiverId: [req.user?._id],
    notifyUser: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} updated pet`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

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

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `Your pet ${result?.full_name} deleted successfully!`,
    },
    receiverId: [req.user?._id],
    notifyUser: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.first_name} ${req.user?.last_name} deleted pet`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet deleted successfully!',
    data: result,
  });
});

// ------------------------  Get Pet Adopt Controller ------------------------
const getPetAdopt = catchAsync(async (req, res) => {
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

const findAllAdoptions = catchAsync(async (req, res) => {
  const result = await UserService.findAllDonationsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Adoptions fetched successfully!',
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

  findAllAdoptions,
};
