import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import catchAsync from '../../utils/catchAsync';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';

const updateProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateProfile(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload,
  );
  // console.log('updateProfile result', result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your profile updated successfully!',
    data: result,
  });
});

const myProfile = catchAsync(async (req, res) => {
  // console.log('req.user', req.user);

  const isUser = req.user as IJwtPayload;
  const result = await UserService.myProfile(isUser);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await UserService.changePassword(
    req?.headers?.authorization as string,
    req?.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your password changed successfully',
    data: result,
  });
});

export const UserController = {
  updateProfile,
  myProfile,
  changePassword,
};
