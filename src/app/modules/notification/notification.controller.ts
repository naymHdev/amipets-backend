import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';

const getAllNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getAllNotifications(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All notifications fetched successfully',
    data: result,
  });
});

export const NotificationController = {
  getAllNotifications,
};
