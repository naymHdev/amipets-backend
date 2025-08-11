import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { otpServices } from './otp.service';
// import { NotificationService } from '../notification/notification.service';

const verifyOtp = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const result = await otpServices.verifyOtp(token as string, req.body.otp);

  // await NotificationService.sendNotification({
  //   ownerId: req.user?._id,
  //   key: 'notification',
  //   data: {
  //     id: null,
  //     message: `  ${req.user?.first_name} ${req.user?.last_name} verified otp`,
  //   },
  //   receiverId: [req.user?._id],
  //   notifyAdmin: true,
  // });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const result = await otpServices.resendOtp(req?.body?.email);

  // console.log('resendOtp result', result);

  // await NotificationService.sendNotification({
  //   ownerId: req.user?._id,
  //   key: 'notification',
  //   data: {
  //     id: null,
  //     message: `User resend otp`,
  //   },
  //   receiverId: [req.user?._id],
  //   notifyAdmin: true,
  // });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OTP sent successfully',
    data: result,
  });
});

export const otpController = { verifyOtp, resendOtp };
