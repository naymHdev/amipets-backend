import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';

const router = Router();

//  -------------------------------------- Admin Dashboard --------------------------------------

router.get('/total-status', auth(Role.ADMIN), DashboardController.dbTotalStats);
router.get(
  '/user-status',
  auth(Role.ADMIN),
  DashboardController.dashboardUsersStats,
);
router.get(
  '/shelter-status',
  auth(Role.ADMIN),
  DashboardController.dbShelterStats,
);

//  -------------------------------------- Shelter Dashboard --------------------------------------

router.get(
  '/shelter-total-status',
  auth(Role.SHELTER),
  DashboardController.shelterTotalStats,
);

router.get(
  '/pets-overview',
  auth(Role.SHELTER),
  DashboardController.petsOverView,
);

router.get(
  '/pets-donets-overview',
  auth(Role.SHELTER),
  DashboardController.petsDonetsOverView,
);

router.get(
  '/find-recent-adopters',
  auth(Role.SHELTER),
  DashboardController.findRecentAdopters,
);

export const DashboardRoutes = router;
