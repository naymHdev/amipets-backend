import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';
import { single_image_Upload } from '../../utils/imageUploader';
import { parseBody } from '../../middleware/bodyParser';

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

// --------------------------------- Banner Routes ---------------------------------
router.post(
  '/create-banner',
  single_image_Upload.single('image'),
  parseBody,
  validateRequest(AdminValidation.bannerSchema),
  AdminController.createBanner,
);

router.get('/get-banner', AdminController.getBanner);

router.patch(
  '/update-banner',
  single_image_Upload.single('image'),
  parseBody,
  validateRequest(AdminValidation.updateBannerSchema),
  AdminController.updateBanner,
);

export const AdminRoutes = router;
