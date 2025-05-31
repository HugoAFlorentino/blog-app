import Router from 'express';
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByUser,
  patchPost,
  restorePost,
} from '../controllers/blog.controller.js';
import authenticateUser from '../middleware/authUser.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const blogRouter = Router();

blogRouter.post('/blog', authenticateUser, createPost);
blogRouter.patch('/blog/:id', authenticateUser, patchPost);
blogRouter.post('/blog/:id', authenticateUser, deletePost);
blogRouter.get('/blog', getPosts);
blogRouter.get('/blog/:id', getPostById);
blogRouter.get('/blog/:id', getPostById);
blogRouter.patch('/blog/restore/:id', authenticateUser, restorePost);
blogRouter.get('/blog/user/:userId', authenticateUser, getPostsByUser);

export default blogRouter;
