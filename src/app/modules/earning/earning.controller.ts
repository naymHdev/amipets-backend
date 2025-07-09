import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EarningService } from './earning.service';
import { NotificationService } from '../notification/notification.service';

const addIncome = catchAsync(async (req, res) => {
  const result = await EarningService.addIncomeFromDB(req.body);

  await NotificationService.sendNotification({
    ownerId: req.user?._id,
    key: 'notification',
    data: {
      id: null,
      message: ` ${req.user?.firstName} ${req.user?.lastName} added income`,
    },
    receiverId: [req.user?._id],
    notifyAdmin: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Income added successfully',
    data: result,
  });
});

const findAllEarnings = catchAsync(async (req, res) => {
  const result = await EarningService.findAllEarnings(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Income fetched successfully',
    data: result,
  });
});

const transactionDetails = catchAsync(async (req, res) => {
  const result = await EarningService.transactionDetails(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Income fetched successfully',
    data: result,
  });
});

const incomeStatus = catchAsync(async (req, res) => {
  const result = await EarningService.incomeStatus();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Income status retrieved successfully',
    data: result,
  });
});

export const EarningController = {
  addIncome,
  findAllEarnings,
  transactionDetails,
  incomeStatus,
};
