import { Request, Response, NextFunction } from 'express';
import { HttpCode } from '../enums/httpCode';
import { VALIDATOR_ERROR_EMAIL, VALIDATOR_ERROR_USERNAME, VALIDATOR_ERROR_PASSWORD, VALIDATOR_ERROR_FULLNAME, } from '../utils/constants';
import util from 'util';
import { responseError } from '../utils/responseHandler';
const { body, validationResult } = require('express-validator');

const options = {
  password: {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  },
  userName: {
    minLength: 6,
  },
  fullName: {
    minLength: 6,
  }
};

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    responseError(res, HttpCode.BAD_REQUEST, errors.array());
  } else {
    next();
  }
};

export const SignUpValidator = [
  body('userName')
    .isLength({ min: options.userName.minLength })
    .withMessage(util.format(VALIDATOR_ERROR_USERNAME, options.userName.minLength)),
  body('password')
    .isStrongPassword({
      minLength: options.password.minLength,
      minLowercase: options.password.minLowercase,
      minUppercase: options.password.minUppercase,
      minNumbers: options.password.minNumbers,
      minSymbols: options.password.minSymbols,
    })
    .withMessage(
      util.format(
        VALIDATOR_ERROR_PASSWORD,
        options.password.minLength,
        options.password.minLowercase,
        options.password.minUppercase,
        options.password.minNumbers,
        options.password.minSymbols
      )
    ),
    body('email')
    .isEmail()
    .withMessage(VALIDATOR_ERROR_EMAIL),
];

export const LoginValidator = [
  body('userName')
    .isLength({ min: options.userName.minLength })
    .withMessage('UInvalid username or password'),
  body('password')
    .isStrongPassword({
      minLength: options.password.minLength,
      minLowercase: options.password.minLowercase,
      minUppercase: options.password.minUppercase,
      minNumbers: options.password.minNumbers,
      minSymbols: options.password.minSymbols,
    })
    .withMessage('Invalid username or password'),
];


export const paymentValidator = [
  body('amount').isNumeric().withMessage('Số tiền phải là một số'),
  body('note').isString().withMessage('Ghi chú phải là một chuỗi'),
];