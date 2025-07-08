import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { OtpRoutes } from '../modules/otp/otp.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { PetRoutes } from '../modules/pet/pet.routes';
import { AdminRoutes } from '../modules/admin/admin.route';
import ShelterRoutes from '../modules/shelter/shelter.routes';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { BookmarkRoutes } from '../modules/bookmarks/bookmarks.routes';
import { DashboardRoutes } from '../modules/dashboard/dashboard.routes';
import { EarningRoutes } from '../modules/earning/earning.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/otp',
    route: OtpRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/shelter',
    route: ShelterRoutes,
  },
  {
    path: '/pets',
    route: PetRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/bookmarks',
    route: BookmarkRoutes,
  },
  {
    path: '/dashboards',
    route: DashboardRoutes,
  },
  {
    path: '/earning',
    route: EarningRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
