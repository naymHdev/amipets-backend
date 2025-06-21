import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';

const router = Router();

router.get('/get-about', AdminController.getAbout);
router.post(
  '/create-about',
  validateRequest(AdminValidation.aboutSchema),
  AdminController.createAbout,
);
router.patch(
  '/update-about',
  validateRequest(AdminValidation.updateAboutSchema),
  AdminController.updateAbout,
);

router.get('/get-privacy-policy', AdminController.getPrivacyPolicy);
router.post(
  '/create-privacy-policy',
  validateRequest(AdminValidation.privacyPolicySchema),
  AdminController.createPrivacyPolicy,
);
router.patch(
  '/update-privacy-policy',
  validateRequest(AdminValidation.updatePrivacyPolicySchema),
  AdminController.updatePrivacyPolicy,
);

router.get('/get-terms-of-condition', AdminController.getTermsAndCondition);
router.post(
  '/create-terms-of-condition',
  validateRequest(AdminValidation.termsOfServiceSchema),
  AdminController.createTermsAndCondition,
);
router.patch(
  '/update-terms-of-condition',
  validateRequest(AdminValidation.updateTermsOfServiceSchema),
  AdminController.updateTermsAndCondition,
);

export const AdminRoutes = router;
