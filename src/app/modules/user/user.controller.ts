import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { IImageFile } from '../../interface/IImageFile';
import { IJwtPayload } from '../auth/auth.interface';

const updateProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateProfile(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'profile updated successfully',
    data: result,
  });
});

export const UserController = {
  updateProfile,
};
