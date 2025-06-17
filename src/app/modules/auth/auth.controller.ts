import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import config from '../../config';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUserFromDB(req.body);
  console.log('register result', result);

  // const { accessToken, refreshToken } = result;

  //   res.cookie('refreshToken', refreshToken, {
  //     secure: config.NODE_ENV === 'production',
  //     httpOnly: true,
  //     sameSite: 'none',
  //     maxAge: 1000 * 60 * 60 * 24 * 365,
  //   });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'You are registered successfully!',
    data: null,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserFromDB(req.body);
  const { refreshToken, accessToken } = result;
//   console.log('loginUser', result);

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'You are logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { authorization } = req.headers;

  const result = await AuthService.refreshToken(authorization as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Your token is refreshed successfully!',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
};
