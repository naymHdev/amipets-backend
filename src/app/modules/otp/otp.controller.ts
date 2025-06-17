import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { otpServices } from './otp.service';

const verifyOtp = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const result = await otpServices.verifyOtp(token as string, req.body.otp);

  console.log('verifyOtp result', result, 'token', token);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

const resendOtp = catchAsync(async (req, res) => {
  const result = await otpServices.resendOtp(req?.body?.email);

  console.log('resendOtp result', result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OTP sent successfully',
    data: result,
  });
});

export const otpController = { verifyOtp, resendOtp };
