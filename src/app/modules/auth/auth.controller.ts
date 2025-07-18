import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { otpServices } from '../otp/otp.service';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserFromDB(req.body);

  let otpToken;
  if (result?.isVerified == false) {
    otpToken = await otpServices.resendOtp(result?.email);
  }

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'You are registered successfully!',
    data: {
      user: result,
      otpToken: otpToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserFromDB(req.body);
  const { refreshToken, accessToken, user } = result;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'You are logged in successfully!',
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  const result = await AuthService.refreshToken(refreshToken as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Your token is refreshed successfully!',
    data: result,
  });
});

const fagotPassword = catchAsync(async (req, res) => {
  const result = await AuthService.forgotPassword(req?.body?.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'An OTP sent to your email!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {

  const result = await AuthService.resetPassword(
    req?.headers?.authorization as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  fagotPassword,
  resetPassword,
};
