import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { EarningValidation } from './earning.validation';
import { EarningController } from './earning.controller';
import auth from '../../middleware/auth';
import { Role } from '../auth/auth.interface';

const router = Router();

router.post(
  '/create-earning',
  auth(Role.ADMIN),
  validateRequest(EarningValidation.createIncomeSchema),
  EarningController.addIncome,
);

router.get('/all-earnings', EarningController.findAllEarnings);

router.get('/earning-details/:id', EarningController.transactionDetails);

router.get('/earning-status', EarningController.incomeStatus);

router.delete(
  '/delete-earning/:id',
  auth(Role.ADMIN),
  EarningController.deleteIncome,
);

export const EarningRoutes = router;
