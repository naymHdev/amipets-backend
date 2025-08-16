import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';
import { IJwtPayload } from '../auth/auth.interface';

const getAllNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getAllNotifications(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All notifications fetched successfully',
    data: result,
  });
});

const deleteNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  await NotificationService.deleteNotification(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Notification deleted successfully',
    data: null,
  });
});

const deleteAllNotifications = catchAsync(async (req, res) => {
  await NotificationService.deleteAllNotifications();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All notifications deleted successfully',
    data: null,
  });
});

const getAllUserNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getAllUserNotifications(
    req.user as IJwtPayload,
    req.query,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users All notifications fetched successfully',
    data: result,
  });
});

export const NotificationController = {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  getAllUserNotifications,
};
