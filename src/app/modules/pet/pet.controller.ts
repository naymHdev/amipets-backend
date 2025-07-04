import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import { PetServices } from './pet.service';
import config from '../../config';
import { NotificationService } from '../notification/notification.service';

const createPet = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];

  const filePaths = files.map((file) => {
    return (
      (file?.filename && config.BASE_URL + '/images/' + file.filename) || ''
    );
  });

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
      message: `New pet added`,
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

const updatePet = catchAsync(async (req, res) => {
  const petId = req.params.id;
  const payload = req.body;
  const files = req.files as Express.Multer.File[];
  const filePaths = files.map((file) => {
    return (
      (file?.filename && config.BASE_URL + '/images/' + file.filename) || ''
    );
  });
  const authUser = req.user as IJwtPayload;

  const result = await PetServices.updatePetFromDB(
    petId,
    payload,
    filePaths,
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
  const result = await PetServices.getMyPets(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your pets fetched successfully!',
    data: result,
  });
});

const getAllPets = catchAsync(async (req, res) => {
  const result = await PetServices.getAllPetsFromDB(req.query);
  // console.log('result', result);

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

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Pet deleted successfully!',
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
};
