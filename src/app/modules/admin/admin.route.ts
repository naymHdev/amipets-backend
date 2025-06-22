import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.controller';
import { single_image_Upload } from '../../utils/imageUploader';
import { parseBody } from '../../middleware/bodyParser';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';

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

// --------------------------------- Services Routes ---------------------------------
router.post(
  '/create-service',
  auth(Role.ADMIN),
  single_image_Upload.single('icon'),
  parseBody,
  validateRequest(AdminValidation.servicesSchema),
  AdminController.createService,
);

router.get('/get-service', AdminController.getService);

router.patch(
  '/update-service/:id',
  auth(Role.ADMIN),
  single_image_Upload.single('icon'),
  parseBody,
  validateRequest(AdminValidation.updateServicesSchema),
  AdminController.updateService,
);

router.delete(
  '/delete-service/:id',
  auth(Role.ADMIN),
  AdminController.deletedService,
);

// --------------------------------- Add Website Routes ---------------------------------
router.post(
  '/add-website',
  auth(Role.ADMIN),
  single_image_Upload.single('web_img'),
  parseBody,
  validateRequest(AdminValidation.addWebsiteSchema),
  AdminController.createAddWebsite,
);

router.get('/get-website', AdminController.getAddWebsite);

router.get('/website-detail/:id', AdminController.getAddWebsiteDetail);

router.delete(
  '/delete-website/:id',
  auth(Role.ADMIN),
  AdminController.deletedAddWebsite,
);

export const AdminRoutes = router;
