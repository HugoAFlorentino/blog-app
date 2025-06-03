import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateForgotPassword = [
  body('email').isEmail().withMessage('A valid email is required'),
];

export const validateResetPassword = [
  param('id').custom(isValidObjectId).withMessage('Invalid user ID'),
  param('token').notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];
