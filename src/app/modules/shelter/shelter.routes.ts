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
router.get('/get-survey', auth(Role.SHELTER), ShelterController.getSurvey);
router.get(
  '/get-single-survey/:id',
  auth(Role.SHELTER),
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

const ShelterRoutes = router;
export default ShelterRoutes;
