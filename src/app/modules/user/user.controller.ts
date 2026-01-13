import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import { IJwtPayload } from '../auth/auth.interface';
import { NotificationService } from '../notification/notification.service';
import { Types } from 'mongoose';
import User from '../auth/auth.model';
import { uploadToS3 } from '../../utils/s3';

const updateProfile = catchAsync(async (req, res) => {
  const file = req.file;

  let profileImageURL: string | null = '';
  if (file) {
    const fileName = `profile_image/${Date.now()}-${file.originalname}`;
    profileImageURL = await uploadToS3({
      file: file,
      fileName,
    });
  }

  const result = await UserService.updateProfile(
    req.body,
    profileImageURL as string,
    req.user as IJwtPayload,
  );
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
      message: ` ${req.user?.first_name} ${req.user?.last_name} changed password`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: false,
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
      message: ` ${req.user?.first_name} ${req.user?.last_name} deleted profile`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: false,
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
  const file = req.file;

  let pet_img: string | null = '';
  if (file) {
    const fileName = `pet_image/${Date.now()}-${file.originalname}`;
    pet_img = await uploadToS3({
      file: file,
      fileName,
    });
  }

  const result = await UserService.createMyPetFromDB(
    req.body,
    pet_img as string,
    req.user as IJwtPayload,
  );

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.first_name} ${req.user?.last_name} Your pet created successfully!`,
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
    notifyAdmin: false,
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
  const file = req.file;

  let pet_img: string | null = '';
  if (file) {
    const fileName = `pet_image/${Date.now()}-${file.originalname}`;
    pet_img = await uploadToS3({
      file: file,
      fileName,
    });
  }
  const authUser = req.user as IJwtPayload;

  const result = await UserService.updateMyPetFromDB(
    petId as string,
    payload,
    pet_img as string,
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
    notifyAdmin: false,
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
  const result = await UserService.getSinglePet(petId as string);
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
    notifyAdmin: false,
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

  const petName = (result.adopted_pet as any)?.full_name;
  const petType = (result.adopted_pet as any)?.pet_category;
  const ownerId = (result.adopted_pet as any)?.owner;
  const adoptionId = result?._id.toString();

  // Messages
  const ownerMessage = `Your ${petType} "${petName}" has received a new adoption request.`;
  const adminMessage = `A new adoption request has been submitted for the ${petType} "${petName}".`;

  // --- 1. Notify Pet Owner ---
  await NotificationService.sendNotification({
    ownerId: ownerId,
    key: 'notification',
    data: {
      id: adoptionId,
      message: ownerMessage,
    },
    receiverId: [ownerId],
    notifyShelter: true,
  });

  // --- 2. Notify Admin(s) ---
  const admins = await User.find({ role: 'admin' }, '_id');
  const adminIds = admins.map((a) => new Types.ObjectId(a._id.toString()));

  await NotificationService.sendNotification({
    ownerId: ownerId,
    key: 'notification',
    data: {
      id: adoptionId,
      message: adminMessage,
    },
    receiverId: adminIds,
    notifyAdmin: false,
  });

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
