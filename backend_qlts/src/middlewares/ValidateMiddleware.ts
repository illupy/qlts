import { check } from 'express-validator'
import { UserRole } from '../constant/AppConstant'

export const validateLogin = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isString().notEmpty().withMessage('Password is required'),
]
export const validateRegister = [
  check('name').isString().notEmpty().withMessage('Name is required'),
  // check('role').isIn([UserRole.ADMIN, UserRole.USER, UserRole.BUL]).withMessage('Role must be either admin or user or BUL'),
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isString().notEmpty().isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
  check('confirmPassword')
    .isString()
    .notEmpty()
    .withMessage('Confirm password is required')
]
