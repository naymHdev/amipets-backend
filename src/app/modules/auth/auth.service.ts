import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IAuth, IJwtPayload, IUser } from './auth.interface';
import User from './auth.model';
import mongoose from 'mongoose';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const loginUserFromDB = async (payload: IAuth) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findOne({ email: payload.email }).session(session);
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'You are not registered!');
    }

    if (!user.verification?.status) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You are not verified! Please verify your email address. Check your inbox.',
      );
    }

    if (!user.isActive) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Your account is not active');
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'Wrong password please try again',
      );
    }

    const jwtPayload: IJwtPayload = {
      _id: user._id as string,
      first_name: user.first_name as string,
      last_name: user.last_name as string,
      email: user.email as string,
      isActive: user.isActive,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    // console.log('accessToken', accessToken);

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    await session.commitTransaction();

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const registerUserFromDB = async (userData: IUser) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // check if user already exists
    const isUserExist = await User.findOne({ email: userData.email }).session(
      session,
    );
    if (isUserExist) {
      throw new Error('You are already registered');
    }

    if (isUserExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'You are already registered');
    }

    const user = new User(userData);
    const result = await user.save({ session });

    await session.commitTransaction();

    return result;
  } catch (error: any) {
    console.log('registerUserFromDB error', error);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    throw error;
  } finally {
    session.endSession();
  }
};

// refresh token logic here
const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as Secret);
  } catch (err: any) {
    console.log(err);
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Please authenticate yourself first',
    );
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not authorized!');
  }

  if (!isUserExist.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Your account is not active.');
  }

  const jwtPayload: IJwtPayload = {
    _id: isUserExist._id as string,
    first_name: isUserExist.first_name as string,
    last_name: isUserExist.last_name as string,
    email: isUserExist.email as string,
    isActive: isUserExist.isActive,
    role: isUserExist.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  registerUserFromDB,
  loginUserFromDB,
  refreshToken,
};
