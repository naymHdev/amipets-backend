import { Router } from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';

const router = Router();

router.get(
  '/all-notifications',
  auth(Role.ADMIN),
  NotificationController.getAllNotifications,
);

export const NotificationRoutes = router;
