import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/appError';
import { IAuth, IJwtPayload, IUser } from './auth.interface';
import User from './auth.model';
import mongoose from 'mongoose';
import { createToken, verifyToken } from './auth.utils';
import config from '../../config';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { generateOtp } from '../../utils/otpGenerator';
import moment from 'moment';
import path from 'path';
import { sendEmail } from '../../utils/mailSender';
import fs from 'fs';
import bcrypt from 'bcrypt';

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
      user: user,
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

const refreshToken = async (token: string) => {
  // console.log('refreshToken', token);
  // console.log('🔑 Using secret:', config.jwt_access_secret);
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

  const { _id } = verifiedToken;

  const isUserExist = await User.findById(_id);
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

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'You are not registered!');
  }

  const jwtPayload = {
    email: email,
    userId: user?._id,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '3m',
  });

  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(3, 'minute');

  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
    },
  });

  const otpEmailPath = path.resolve(
    process.cwd(),
    'src',
    'app',
    'public',
    'view',
    'forgot_pass_mail.html',
  );

  await sendEmail(
    user?.email,
    'Your reset password OTP is',
    fs
      .readFileSync(otpEmailPath, 'utf8')
      .replace('{{otp}}', otp)
      .replace('{{email}}', user?.email),
  );

  return { email, token };
};

const resetPassword = async (
  token: string,
  payload: { newPassword: string; confirmPassword: string },
) => {
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (err: any) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Session has expired. Please try again',
    );
  }

  // console.log('decode', decode);

  const user: IUser | null = await User.findById(decode?.userId)

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (
    !user?.verification?.expiresAt ||
    new Date() > new Date(user.verification.expiresAt)
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Session has expired');
  }

  if (!user?.verification?.status) {
    throw new AppError(StatusCodes.FORBIDDEN, 'OTP is not verified yet');
  }

  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'New password and confirm password do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(decode?.userId, {
    password: hashedPassword,
    verification: {
      otp: 0,
      status: true,
    },
  });

  return result;
};

export const AuthService = {
  registerUserFromDB,
  loginUserFromDB,
  refreshToken,
  forgotPassword,
  resetPassword,
};
