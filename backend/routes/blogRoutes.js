import Router from 'express';
import {
  createPost,
  deletePost,
  getPosts,
  patchPost,
} from '../controllers/blog.controller.js';
import authenticateUser from '../middleware/authUser.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const blogRouter = Router();

blogRouter.post('/blog', authenticateUser, createPost);
blogRouter.patch('/blog/:id', authenticateUser, patchPost);
blogRouter.post('/blog/:id', authenticateUser, deletePost);
blogRouter.get('/blog', getPosts);

export default blogRouter;
