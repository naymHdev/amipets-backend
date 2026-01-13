import { Router } from 'express';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';
import { parseBody } from '../../middleware/bodyParser';
import { PetController } from './pet.controller';
import { petValidation } from './pet.validation';
import validateRequest from '../../middleware/validateRequest';
import { uploadFactory } from '../../middleware/uploadFactory';

const router = Router();
router.get('/breeds', PetController.findBreeds);
router.get('/locations', PetController.findLocations);
router.get('/cities', PetController.findCities);

router.post(
  '/create-pet',
  auth(Role.SHELTER),
  uploadFactory({ type: 'mixed', maxFiles: 5 }).fields([
    { name: 'pet_image', maxCount: 10 },
    { name: 'pet_reports', maxCount: 10 },
  ]),
  parseBody,
  validateRequest(petValidation.createPetSchema),
  PetController.createPet,
);

router.patch(
  '/:id',
  auth(Role.SHELTER),
  uploadFactory({ type: 'mixed', maxFiles: 5 }).fields([
    { name: 'pet_image', maxCount: 10 },
    { name: 'pet_reports', maxCount: 10 },
  ]),
  parseBody,
  validateRequest(petValidation.updatePetePetSchema),
  PetController.updatePet,
);
router.delete('/petImg/:id', auth(Role.SHELTER), PetController.deletedPetImg);
router.delete(
  '/petReport/:id',
  auth(Role.SHELTER),
  PetController.deletedPetReport,
);

router.get(
  '/all-pets',
  auth(Role.SHELTER, Role.USER, Role.ADMIN),
  PetController.getAllPets,
);

router.get('/my-pets', auth(Role.SHELTER), PetController.getMyPets);

router.get('/:id', PetController.getSinglePet);

router.delete('/:id', auth(Role.SHELTER), PetController.deletePet);

export const PetRoutes = router;
