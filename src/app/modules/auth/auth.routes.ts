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

router.post('/refresh-token', AuthController.refreshToken);

export const AuthRoutes = router;
