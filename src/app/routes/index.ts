import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { OtpRoutes } from '../modules/otp/otp.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { PetRoutes } from '../modules/pet/pet.routes';
import { AdminRoutes } from '../modules/admin/admin.route';
import ShelterRoutes from '../modules/shelter/shelter.routes';
import { NotificationRoutes } from '../modules/notification/notification.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
