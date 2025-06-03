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
import {
  validateCreatePost,
  validateGetPostsQuery,
  validatePatchPost,
  validatePostIdParam,
  validateUserIdParam,
} from '../validators/blogValidators.js';
import { validateRequest } from '../middleware/validateRequest.js';

const blogRouter = Router();

blogRouter.post(
  '/blog',
  authenticateUser,
  validateCreatePost,
  validateRequest,
  createPost
);
blogRouter.patch(
  '/blog/:id',
  authenticateUser,
  validatePatchPost,
  validateRequest,
  patchPost
);
blogRouter.post(
  '/blog/:id',
  authenticateUser,
  validatePostIdParam,
  validateRequest,
  deletePost
);
blogRouter.patch(
  '/blog/restore/:id',
  authenticateUser,
  validatePostIdParam,
  validateRequest,
  restorePost
);
blogRouter.get('/blog', validateGetPostsQuery, validateRequest, getPosts);
blogRouter.get('/blog/:id', validatePostIdParam, validateRequest, getPostById);
blogRouter.get(
  '/blog/user/:userId',
  authenticateUser,
  validateUserIdParam,
  validateRequest,
  getPostsByUser
);

export default blogRouter;
