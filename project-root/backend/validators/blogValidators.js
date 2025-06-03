import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateCreatePost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
];

export const validatePatchPost = [
  param('id').custom(isValidObjectId).withMessage('Invalid post ID'),
  body().custom((body) => {
    if (!body.title && !body.body) {
      throw new Error('At least title or body must be provided');
    }
    return true;
  }),
];

export const validatePostIdParam = [
  param('id').custom(isValidObjectId).withMessage('Invalid post ID'),
];

export const validateUserIdParam = [
  param('userId').custom(isValidObjectId).withMessage('Invalid user ID'),
];

export const validateGetPostsQuery = [
  query('title')
    .optional()
    .isString()
    .withMessage('Title filter must be a string'),
];
