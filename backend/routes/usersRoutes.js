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
  getUsers,
} from '../controllers/user.controller.js';
import authenticateUser from '../middleware/authUser.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
  validateChangePassword,
  validateDeleteUser,
  validateRestoreUser,
} from '../validators/userValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';

const userRouter = Router();

userRouter.post(
  '/users/signup',
  validateCreateUser,
  validateRequest,
  createUser
);
userRouter.post('/users/signin', validateLoginUser, validateRequest, loginUser);
userRouter.post('/users/logout', authenticateUser, logoutUser);
userRouter.get('/users/refresh', authenticateUser, refreshToken);
userRouter.patch(
  '/users/profile/update',
  authenticateUser,
  validateUpdateUser,
  validateRequest,
  updateUser
);
userRouter.patch(
  '/users/change-password',
  authenticateUser,
  validateChangePassword,
  validateRequest,
  changePassword
);
userRouter.patch(
  '/users/delete/:id',
  authenticateUser,
  validateDeleteUser,
  validateRequest,
  deleteUser
);
userRouter.patch(
  '/users/restore/:id',
  authenticateUser,
  validateRestoreUser,
  validateRequest,
  restoreUser
);
userRouter.get('/users', authenticateUser, authorizeRole('admin'), getUsers);

export default userRouter;
