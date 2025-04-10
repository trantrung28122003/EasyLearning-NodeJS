"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginValidator = exports.SignUpValidator = exports.validate = void 0;
const httpCode_1 = require("../enums/httpCode");
const constants_1 = require("../utils/constants");
const util_1 = __importDefault(require("util"));
const responseHandler_1 = require("../utils/responseHandler");
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
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, errors.array());
    }
    else {
        next();
    }
};
exports.validate = validate;
exports.SignUpValidator = [
    body('userName')
        .isLength({ min: options.userName.minLength })
        .withMessage(util_1.default.format(constants_1.VALIDATOR_ERROR_USERNAME, options.userName.minLength)),
    body('password')
        .isStrongPassword({
        minLength: options.password.minLength,
        minLowercase: options.password.minLowercase,
        minUppercase: options.password.minUppercase,
        minNumbers: options.password.minNumbers,
        minSymbols: options.password.minSymbols,
    })
        .withMessage(util_1.default.format(constants_1.VALIDATOR_ERROR_PASSWORD, options.password.minLength, options.password.minLowercase, options.password.minUppercase, options.password.minNumbers, options.password.minSymbols)),
    body('email')
        .isEmail()
        .withMessage(constants_1.VALIDATOR_ERROR_EMAIL),
];
exports.LoginValidator = [
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
