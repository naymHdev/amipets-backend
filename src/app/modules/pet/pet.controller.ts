import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import { PetServices } from './pet.service';
import config from '../../config';
import { NotificationService } from '../notification/notification.service';

const createPet = catchAsync(async (req, res) => {
  const files = req.files as {
    pet_image: Express.Multer.File[];
    pet_reports?: Express.Multer.File[];
  };

  const filePaths = files?.pet_image?.map((file) => {
    return (
      (file?.filename && config.BASE_URL + '/images/' + file.filename) || ''
    );
  });

  const pet_reports = files?.pet_reports?.map((file) => {
    return file?.filename && config.BASE_URL + '/images/' + file.filename;
  });

  req.body.pet_reports = pet_reports;

  const result = await PetServices.createPerFromDB(
    req.body,
    filePaths,
    req.user as IJwtPayload,
  );

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.first_name} ${req.user?.last_name} created pet`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `Hay ${req.user?.first_name} ${req.user?.last_name} you created pet successfully!`,
    },
    receiverId: [req.user?._id],
    notifyShelter: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pet created successfully!',
    data: { result },
  });
});

const updatePet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const payload = req.body;

  const files = req.files as {
    pet_image: Express.Multer.File[];
    pet_reports?: Express.Multer.File[];
  };

  const filePaths = files?.pet_image?.map((file) => {
    return (
      (file?.filename && config.BASE_URL + '/images/' + file.filename) || ''
    );
  });

  const pet_reports = files?.pet_reports?.map((file) => {
    return file?.filename && config.BASE_URL + '/images/' + file.filename;
  });

  req.body.pet_reports = pet_reports;

  const authUser = req.user as IJwtPayload;

  const result = await PetServices.updatePetFromDB(
    petId,
    payload,
    filePaths,
    authUser,
  );

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.first_name} ${req.user?.last_name} updated pet`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: false,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `Hay ${req.user?.first_name} ${req.user?.last_name} you updated pet successfully!`,
    },
    receiverId: [req.user?._id],
    notifyShelter: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pet updated successfully!',
    data: result,
  });
});

const deletedPetImg = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const img = req.body.img;

  const result = await PetServices.deletedPetImg(petId, img);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pet updated successfully!',
    data: result,
  });
});

const deletedPetReport = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const report = req.body.report;

  const result = await PetServices.deletedPetReport(petId, report);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet report deleted successfully!',
    data: result,
  });
});

const getMyPets = catchAsync(async (req, res) => {
  const result = await PetServices.getMyPets(
    req.user as IJwtPayload,
    req.query,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pets fetched successfully!',
    data: result,
  });
});

const getAllPets = catchAsync(async (req, res) => {
  // console.log('auth___', req.user);

  const result = await PetServices.getAllPetsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pets fetched successfully!',
    data: result,
  });
});

const getSinglePet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const result = await PetServices.getSinglePet(petId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet fetched successfully!',
    data: result,
  });
});

const deletePet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const result = await PetServices.deleteSinglePet(petId);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `${req.user?.first_name} ${req.user?.last_name} deleted pet`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: false,
  });

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: `Hay ${req.user?.first_name} ${req.user?.last_name} your pet deleted successfully!`,
    },
    receiverId: [req.user?._id],
    notifyShelter: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet deleted successfully!',
    data: result,
  });
});

const findBreeds = catchAsync(async (req, res) => {
  const result = await PetServices.findPetBreads();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Breeds fetched successfully!',
    data: result,
  });
});

const findLocations = catchAsync(async (req, res) => {
  const result = await PetServices.findLocations();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Locations fetched successfully!',
    data: result,
  });
});

const findCities = catchAsync(async (req, res) => {
  const result = await PetServices.findCities();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Cities fetched successfully!',
    data: result,
  });
});

export const PetController = {
  createPet,
  updatePet,
  getAllPets,
  getMyPets,
  getSinglePet,
  deletePet,
  deletedPetImg,
  findBreeds,
  findLocations,
  findCities,
  deletedPetReport,
};
