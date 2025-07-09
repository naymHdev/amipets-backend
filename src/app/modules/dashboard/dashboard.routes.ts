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

export const DashboardRoutes = router;
