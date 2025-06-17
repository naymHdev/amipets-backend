import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { OtpRoutes } from '../modules/otp/otp.routes';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
