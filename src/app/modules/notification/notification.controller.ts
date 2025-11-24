import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';
import { IJwtPayload } from '../auth/auth.interface';

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
  const user = req.user as IJwtPayload;

  await NotificationService.deleteAllNotifications(user);
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

const markNotificationsAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markNotificationsAsRead(
    req.user as IJwtPayload,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users unread notifications fetched successfully',
    data: result,
  });
});

export const NotificationController = {
  deleteNotification,
  deleteAllNotifications,
  markNotificationsAsRead,
  getAllUserNotifications,
};
