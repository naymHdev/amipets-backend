import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShelterServices } from './shelter.service';
import { NotificationService } from '../notification/notification.service';

const createSurvey = catchAsync(async (req, res) => {
  const userId = req.user?._id as string;
  if (!userId) {
    throw new Error('You are not authorized! ');
  }

  const result = await ShelterServices.createSurveyFromDB(req.body, userId);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.firstName} ${req.user?.lastName} created survey question`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question created successfully',
    data: result,
  });
});

const getSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.getSurveyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question fetched successfully',
    data: result,
  });
});

const getSingleSurveyFromDB = catchAsync(async (req, res) => {
  const result = await ShelterServices.getSingleSurveyFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question fetched successfully',
    data: result,
  });
});

const deleteSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.deleteSurvey(req.params.id);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.firstName} ${req.user?.lastName} deleted survey question`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question deleted successfully',
    data: result,
  });
});

const updateSurvey = catchAsync(async (req, res) => {
  const result = await ShelterServices.updateSurvey(req.params.id, req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: result?._id.toString(),
      message: ` ${req.user?.firstName} ${req.user?.lastName} updated survey question`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Survey question updated successfully',
    data: result,
  });
});

const mySurveyQs = catchAsync(async (req, res) => {
  const userId = req.user?._id as string;
  const result = await ShelterServices.mySurveyQs(userId, req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My survey questions fetched successfully',
    data: result,
  });
});

const updateUserRequest = catchAsync(async (req, res) => {
  const result = await ShelterServices.updateUserRequest(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User request updated successfully',
    data: result,
  });
});

export const ShelterController = {
  createSurvey,
  getSurvey,
  deleteSurvey,
  getSingleSurveyFromDB,
  updateSurvey,
  mySurveyQs,
  updateUserRequest,
};
