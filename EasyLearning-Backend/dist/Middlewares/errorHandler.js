"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const httpCode_1 = require("../enums/httpCode");
const errorHandler = (err, req, res, next) => {
    const status = err.status || httpCode_1.HttpCode.INTERNAL_SERVER;
    const message = err.message || 'Internal Server Error';
    (0, responseHandler_1.responseError)(res, status, message);
};
exports.errorHandler = errorHandler;
