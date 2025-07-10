import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.userValidationSchema),
  AuthController.registerUser,
);

router.post('/login', AuthController.loginUser);

router.post(
  '/refresh-token',
  // auth(Role.USER, Role.ADMIN, Role.SHELTER),
  AuthController.refreshToken,
);

router.post(
  '/forgot-password',
  AuthController.fagotPassword,
  validateRequest(AuthValidation.forgotPassValidation),
);

router.post(
  '/reset-password',
  AuthController.resetPassword,
  // validateRequest(AuthValidation.resetPassValidation),
);

export const AuthRoutes = router;
