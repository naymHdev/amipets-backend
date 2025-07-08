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
  auth(Role.ADMIN),
  validateRequest(AdminValidation.aboutSchema),
  AdminController.createAbout,
);
router.patch(
  '/update-about',
  auth(Role.ADMIN),
  validateRequest(AdminValidation.updateAboutSchema),
  AdminController.updateAbout,
);

router.get('/get-privacy-policy', AdminController.getPrivacyPolicy);
router.post(
  '/create-privacy-policy',
  auth(Role.ADMIN),
  validateRequest(AdminValidation.privacyPolicySchema),
  AdminController.createPrivacyPolicy,
);
router.patch(
  '/update-privacy-policy',
  auth(Role.ADMIN),
  validateRequest(AdminValidation.updatePrivacyPolicySchema),
  AdminController.updatePrivacyPolicy,
);

router.get('/get-terms-of-condition', AdminController.getTermsAndCondition);
router.post(
  '/create-terms-of-condition',
  auth(Role.ADMIN),
  validateRequest(AdminValidation.termsOfServiceSchema),
  AdminController.createTermsAndCondition,
);
router.patch(
  '/update-terms-of-condition',
  auth(Role.ADMIN),
  validateRequest(AdminValidation.updateTermsOfServiceSchema),
  AdminController.updateTermsAndCondition,
);

// --------------------------------- Banner Routes ---------------------------------
router.post(
  '/create-banner',
  auth(Role.ADMIN),
  single_image_Upload.single('image'),
  parseBody,
  validateRequest(AdminValidation.bannerSchema),
  AdminController.createBanner,
);

router.get('/get-banner', AdminController.getBanner);

router.patch(
  '/update-banner/:banner',
  auth(Role.ADMIN),
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
router.get('/service-detail/:id', AdminController.getSingleService);
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
router.get('/service-base-webs/:id', AdminController.serviceBaseWeb);
router.get('/website-detail/:id', AdminController.getAddWebsiteDetail);

router.delete(
  '/delete-website/:id',
  auth(Role.ADMIN),
  AdminController.deletedAddWebsite,
);

// ---------------------------- Control Users Routes ----------------------------
router.get('/get-users', auth(Role.ADMIN), AdminController.getAllUsers);
router.get('/user-detail/:id', auth(Role.ADMIN), AdminController.getUserDetail);
router.patch('/block-user/:id', auth(Role.ADMIN), AdminController.blockUser);
router.patch(
  '/unblock-user/:id',
  auth(Role.ADMIN),
  AdminController.unblockUser,
);

// ---------------------------- Control Shelters Routes ----------------------------
router.get('/get-shelters', auth(Role.ADMIN), AdminController.getAllShelter);
router.get(
  '/shelter-detail/:id',
  auth(Role.ADMIN),
  AdminController.getShelterDetail,
);
router.patch(
  '/block-shelter/:id',
  auth(Role.ADMIN),
  AdminController.blockShelter,
);

// --------------------------------- Admin Profile Routes ---------------------------------
router.put(
  '/update-admin-profile',
  auth(Role.ADMIN),
  single_image_Upload.single('profile_image'),
  parseBody,
  validateRequest(AdminValidation.adminProfileUpdateValidationSchema),
  AdminController.editAdminProfile,
);

router.get('/admin-profile', auth(Role.ADMIN), AdminController.adminProfile);

export const AdminRoutes = router;
