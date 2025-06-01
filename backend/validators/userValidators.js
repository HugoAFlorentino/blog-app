import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateCreateUser = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('recaptchaToken')
    .notEmpty()
    .withMessage('reCAPTCHA token is required')
    .isString()
    .withMessage('reCAPTCHA token must be a string'),
];

export const validateLoginUser = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid'),

  body('password').notEmpty().withMessage('Password is required'),

  body('recaptchaToken')
    .notEmpty()
    .withMessage('reCAPTCHA token is required')
    .isString()
    .withMessage('reCAPTCHA token must be a string'),
];

export const validateUpdateUser = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid'),
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),
];

export const validateDeleteUser = [
  param('id').custom(isValidObjectId).withMessage('Invalid user ID'),
];

export const validateRestoreUser = [
  param('id').custom(isValidObjectId).withMessage('Invalid user ID'),
];
