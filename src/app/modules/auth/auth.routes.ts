import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { otpController } from '../otp/otp.controller';
import { otpValidation } from '../otp/otp.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.userValidationSchema),
  AuthController.registerUser,
);

router.post('/login', AuthController.loginUser);

router.post('/refresh-token', AuthController.refreshToken);

router.post(
  '/verify-otp',
  otpController.verifyOtp,
  validateRequest(otpValidation.otpVerifySchema),
);

router.post(
  '/resend-otp',
  otpController.resendOtp,
  validateRequest(otpValidation.otpResendSchema),
);

export const AuthRoutes = router;
