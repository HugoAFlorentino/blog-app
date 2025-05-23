import { Router } from 'express';
import { createUser, loginUser } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/users/signup', createUser);
userRouter.post('/users/signin', loginUser);

export default userRouter;
