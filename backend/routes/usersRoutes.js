import { Router } from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  updateUser,
} from '../controllers/user.controller.js';
import authenticateUser from '../middleware/authUser.js';

const userRouter = Router();

userRouter.post('/users/signup', createUser);
userRouter.post('/users/signin', loginUser);
userRouter.post('/users/logout', authenticateUser, logoutUser);
userRouter.patch('/users/profile/update', authenticateUser, updateUser);
userRouter.get('/users/refresh', authenticateUser, refreshToken);

export default userRouter;
