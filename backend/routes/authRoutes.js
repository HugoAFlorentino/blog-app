import Router from 'express';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/user.controller.js';

const authRouter = Router();

authRouter.post('/auth/reset-password', forgotPassword);
authRouter.post('/auth/reset-password/:id/:token', resetPassword);

export default authRouter;
