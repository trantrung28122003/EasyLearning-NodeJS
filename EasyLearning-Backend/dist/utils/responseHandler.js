"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseCookie = exports.responseError = exports.responseSuccess = void 0;
const httpCode_1 = require("../enums/httpCode");
const responseSuccess = (res, data, message = 'Success') => {
    const response = {
        code: httpCode_1.HttpCode.OK,
        message,
        result: data,
    };
    res.status(httpCode_1.HttpCode.OK).send(response);
};
exports.responseSuccess = responseSuccess;
const responseError = (res, code = httpCode_1.HttpCode.INTERNAL_SERVER, message) => {
    const response = {
        code,
        message,
        result: null,
    };
    res.status(code).send(response);
};
exports.responseError = responseError;
const responseCookie = (res, key, value, exp) => {
    res.cookie(key, value, {
        httpOnly: true,
        expires: new Date(exp),
        signed: true,
    });
};
exports.responseCookie = responseCookie;
