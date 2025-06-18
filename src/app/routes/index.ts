import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { OtpRoutes } from '../modules/otp/otp.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { PetRoutes } from '../modules/pet/pet.routes';

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
    path: '/pets',
    route: PetRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
