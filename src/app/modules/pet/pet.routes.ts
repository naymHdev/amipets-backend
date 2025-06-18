import { Router } from 'express';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';
import { parseBody } from '../../middleware/bodyParser';
import { PetController } from './pet.controller';
import { petValidation } from './pet.validation';
import validateRequest from '../../middleware/validateRequest';
import { single_image_Upload } from '../../utils/imageUploader';

const router = Router();

router.post(
  '/create-pet',
  auth(Role.USER, Role.SHELTER),
  single_image_Upload.single('pet_image'),
  parseBody,
  validateRequest(petValidation.createPetSchema),
  PetController.createPet,
);

router.patch(
  '/:id',
  auth(Role.USER, Role.SHELTER),
  single_image_Upload.single('pet_image'),
  parseBody,
  validateRequest(petValidation.updatePetePetSchema),
  PetController.updatePet,
);

router.get('/my-pets', auth(Role.USER), PetController.getMyPets);

router.get('/:id', PetController.getSinglePet);
router.get('/all-pets', PetController.getAllPets);

router.delete('/:id', auth(Role.USER), PetController.deletePet);

export const PetRoutes = router;
