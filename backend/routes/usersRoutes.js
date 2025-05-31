import { Router } from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  refreshToken,
  updateUser,
  changePassword,
  deleteUser,
  restoreUser,
} from '../controllers/user.controller.js';
import authenticateUser from '../middleware/authUser.js';

const userRouter = Router();

userRouter.post('/users/signup', createUser);
userRouter.post('/users/signin', loginUser);
userRouter.post('/users/logout', logoutUser);
userRouter.patch('/users/profile/update', authenticateUser, updateUser);
userRouter.get('/users/refresh', authenticateUser, refreshToken);
userRouter.patch('/users/change-password', authenticateUser, changePassword);
userRouter.patch('/users/delete/:id', authenticateUser, deleteUser);
userRouter.patch('/users/restore/:id', authenticateUser, restoreUser);

export default userRouter;
