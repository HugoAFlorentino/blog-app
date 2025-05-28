import { Router } from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/users/signup', createUser);
userRouter.post('/users/signin', loginUser);
userRouter.post('/users/logout', logoutUser);
userRouter.get('/users/refresh', refreshToken);

export default userRouter;
