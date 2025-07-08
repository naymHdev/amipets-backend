import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { EarningValidation } from './earning.validation';
import { EarningController } from './earning.controller';

const router = Router();

router.post(
  '/create-earning',
  validateRequest(EarningValidation.createIncomeSchema),
  EarningController.addIncome,
);

router.get('/all-earnings', EarningController.findAllEarnings);

router.get('/earning-details/:id', EarningController.transactionDetails);

router.get('/earning-status', EarningController.incomeStatus);

export const EarningRoutes = router;
