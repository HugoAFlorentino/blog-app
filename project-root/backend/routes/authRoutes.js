import Router from 'express';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  validateForgotPassword,
  validateResetPassword,
} from '../validators/authValidators.js';

const authRouter = Router();

authRouter.post(
  '/auth/reset-password',
  validateForgotPassword,
  validateRequest,
  forgotPassword
);
authRouter.post(
  '/auth/reset-password/:id/:token',
  validateResetPassword,
  validateRequest,
  resetPassword
);

export default authRouter;
