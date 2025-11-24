import { Router } from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';

const router = Router();

router.delete(
  '/delete-notification/:id',
  auth(Role.ADMIN, Role.SHELTER, Role.USER),
  NotificationController.deleteNotification,
);

router.delete(
  '/delete-all-notifications',
  auth(Role.ADMIN, Role.SHELTER, Role.USER),
  NotificationController.deleteAllNotifications,
);

router.get(
  '/user-notifications',
  auth(Role.USER, Role.ADMIN, Role.SHELTER),
  NotificationController.getAllUserNotifications,
);

router.patch(
  '/mark-notifications-as-read',
  auth(Role.USER, Role.ADMIN, Role.SHELTER),
  NotificationController.markNotificationsAsRead,
);

export const NotificationRoutes = router;
