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
const express_1 = require("express");
const responseHandler_1 = require("../utils/responseHandler");
const authenController = __importStar(require("../controllers/authController"));
const userController = __importStar(require("../controllers/userController"));
const validator_1 = require("../middlewares/validator");
const upload_1 = __importDefault(require("../middlewares/upload"));
const uploadCloudinaryHandler_1 = require("../utils/uploadCloudinaryHandler");
const router = (0, express_1.Router)();
const httpCode_1 = require("../enums/httpCode");
router.post('/login', validator_1.LoginValidator, validator_1.validate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const token = yield authenController.login(userName, password);
        const exp = Date.now() + 60 * 60 * 1000;
        (0, responseHandler_1.responseCookie)(res, 'token', token, exp);
        (0, responseHandler_1.responseSuccess)(res, token, 'Đăng nhập thành công');
    }
    catch (error) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, error.message || 'Đăng nhập thất bại');
    }
}));
router.post('/signup', upload_1.default.single('avatar'), validator_1.SignUpValidator, validator_1.validate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let avatarUrl = 'https://res.cloudinary.com/demo/image/upload/v123456789/default_avatar.png';
        avatarUrl = yield (0, uploadCloudinaryHandler_1.handleAvatarUpload)(req.file);
        const newUser = yield userController.createUser(Object.assign(Object.assign({}, req.body), { avatarUrl }));
        (0, responseHandler_1.responseSuccess)(res, newUser, 'Tạo tài khoản thành công');
    }
    catch (error) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, error.message || 'Tạo tài khoản thất bại');
    }
}));
router.get('/logout', function (req, res, next) {
    (0, responseHandler_1.responseCookie)(res, 'token', '', Date.now());
    return (0, responseHandler_1.responseSuccess)(res, null, 'Đăng xuất thành công');
});
exports.default = router;
