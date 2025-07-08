import { Router } from 'express';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';
import { UserController } from './user.controller';
import { parseBody } from '../../middleware/bodyParser';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from '../auth/auth.validation';
import { UserValidation } from './user.validation';
import { single_image_Upload } from '../../utils/imageUploader';

const router = Router();

router.get(
  '/profile',
  auth(Role.USER, Role.ADMIN, Role.SHELTER),
  UserController.myProfile,
);

router.put(
  '/:id',
  auth(Role.USER, Role.ADMIN, Role.SHELTER),
  single_image_Upload.single('profile_image'),
  parseBody,
  validateRequest(AuthValidation.userProfileUpdateValidationSchema),
  UserController.updateProfile,
);

router.patch(
  '/change-password',
  auth(Role.USER, Role.ADMIN, Role.SHELTER),
  validateRequest(UserValidation.changePasswordUpdateValidationSchema),
  UserController.changePassword,
);

router.delete('/delete', auth(Role.USER, Role.ADMIN, Role.SHELTER), UserController.deleteProfile);

// ------------------- My pet Routes ----------------------
router.get('/my-pets', auth(Role.USER), UserController.getMyPets);

router.post(
  '/create-my-pet',
  auth(Role.USER),
  single_image_Upload.single('pet_image'),
  parseBody,
  validateRequest(UserValidation.myPetValidationSchema),
  UserController.createMyPet,
);

router.patch(
  '/update-my-pet/:id',
  auth(Role.USER),
  single_image_Upload.single('pet_image'),
  parseBody,
  validateRequest(UserValidation.updateMyPetValidationSchema),
  UserController.updateMyPet,
);

router.delete(
  '/delete-my-pet/:id',
  auth(Role.USER),
  UserController.deleteMyPet,
);

router.get(
  '/my-single-pet/:id',
  auth(Role.USER),
  UserController.getMySinglePet,
);

// Get Pet Adopted
router.post(
  '/getPetAdopt',
  auth(Role.USER),
  validateRequest(UserValidation.petAdoptedValidationSchema),
  UserController.getPetAdopt,
);

export const UserRoutes = router;
