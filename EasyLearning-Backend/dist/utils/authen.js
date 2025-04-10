"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_authorization = exports.check_authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userController = __importStar(require("../controllers/userController"));
const responseHandler_1 = require("./responseHandler");
const httpCode_1 = require("../enums/httpCode");
const check_authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token;
        if (req.headers && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }
        if (!token && ((_a = req.signedCookies) === null || _a === void 0 ? void 0 : _a.token)) {
            token = req.signedCookies.token;
        }
        if (!token) {
            return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.UNAUTHORIZED, "Bạn chưa đăng nhập");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        }
        catch (err) {
            return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn");
        }
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.UNAUTHORIZED, "Phiên đăng nhập đã hết hạn");
        }
        const user = yield userController.getUserById(decoded.id);
        if (!user) {
            return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.NOT_FOUND, "Không tìm thấy người dùng");
        }
        req.user = user;
        next();
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, "Xác thực thất bại");
    }
});
exports.check_authentication = check_authentication;
const check_authorization = (requiredRoles) => {
    return (req, res, next) => {
        var _a;
        const user = req.user;
        const userRole = (_a = user === null || user === void 0 ? void 0 : user.roles) === null || _a === void 0 ? void 0 : _a.name;
        if (!userRole || !requiredRoles.includes(userRole)) {
            return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.FORBIDDEN, 'Bạn không có quyền truy cập');
        }
        next();
    };
};
exports.check_authorization = check_authorization;
