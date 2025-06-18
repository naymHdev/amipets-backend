import { Router } from 'express';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middleware/bodyParser';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from '../auth/auth.validation';
import { UserValidation } from './user.validation';

const router = Router();

router.get('/:id', auth(Role.USER), UserController.myProfile);

router.put(
  '/:id',
  auth(Role.USER),
  multerUpload.single('pet_image'),
  parseBody,
  validateRequest(AuthValidation.userProfileUpdateValidationSchema),
  UserController.updateProfile,
);

router.patch(
  '/change-password',
  auth(Role.USER),
  validateRequest(UserValidation.changePasswordUpdateValidationSchema),
  UserController.changePassword,
);

router.delete('/:id', auth(Role.USER), UserController.deleteProfile);

export const UserRoutes = router;
