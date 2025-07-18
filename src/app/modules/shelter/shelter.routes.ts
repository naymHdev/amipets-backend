import { Router } from 'express';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';
import { ShelterController } from './shelter.controller';
import validateRequest from '../../middleware/validateRequest';
import { ShelterValidation } from './shelter.validation';

const router = Router();

router.post(
  '/create-survey',
  auth(Role.SHELTER),
  validateRequest(ShelterValidation.surveyValidationSchema),
  ShelterController.createSurvey,
);
router.get(
  '/get-survey/:id',
  auth(Role.SHELTER, Role.ADMIN, Role.USER),
  ShelterController.getSurvey,
);

router.get(
  '/get-single-survey/:id',
  auth(Role.SHELTER, Role.ADMIN, Role.USER),
  ShelterController.getSingleSurveyFromDB,
);
router.delete(
  '/delete-survey/:id',
  auth(Role.SHELTER),
  ShelterController.deleteSurvey,
);
router.patch(
  '/update-survey/:id',
  auth(Role.SHELTER),
  validateRequest(ShelterValidation.surveyValidationSchema),
  ShelterController.updateSurvey,
);

router.get('/my-survey', auth(Role.SHELTER), ShelterController.mySurveyQs);

router.patch(
  '/update-user-request/:id',
  auth(Role.SHELTER),
  ShelterController.updateUserRequest,
);

const ShelterRoutes = router;
export default ShelterRoutes;
