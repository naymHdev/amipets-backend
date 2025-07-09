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
  auth(Role.SHELTER),
  single_image_Upload.array('pet_image'),
  parseBody,
  validateRequest(petValidation.createPetSchema),
  PetController.createPet,
);

router.patch(
  '/:id',
  auth(Role.SHELTER),
  single_image_Upload.array('pet_image'),
  parseBody,
  validateRequest(petValidation.updatePetePetSchema),
  PetController.updatePet,
);
router.delete('/petImg/:id', auth(Role.SHELTER), PetController.deletedPetImg);

router.get('/all-pets', PetController.getAllPets);

router.get('/my-pets', auth(Role.SHELTER), PetController.getMyPets);

router.get('/:id', PetController.getSinglePet);

router.delete('/:id', auth(Role.SHELTER), PetController.deletePet);

export const PetRoutes = router;
