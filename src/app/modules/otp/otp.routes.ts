import { Router } from 'express';
import { otpController } from './otp.controller';
import validateRequest from '../../middleware/validateRequest';
import { otpValidation } from './otp.validation';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';

const router = Router();

router.post(
  '/verify-otp',
  otpController.verifyOtp,
  validateRequest(otpValidation.otpVerifySchema),
);

router.post(
  '/resend-otp',
  auth(Role.USER),
  otpController.resendOtp,
  validateRequest(otpValidation.otpResendSchema),
);

export const OtpRoutes = router;
