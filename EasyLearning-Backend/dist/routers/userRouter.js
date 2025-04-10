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
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.routes.ts
const express_1 = require("express");
const UserController = __importStar(require("../controllers/userController"));
const constants = __importStar(require("../utils/constants"));
const responseHandler_1 = require("../utils/responseHandler");
const authen_1 = require("../utils/authen");
const httpCode_1 = require("../enums/httpCode");
const router = (0, express_1.Router)();
router.get('/', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserController.getAllUsers();
        return (0, responseHandler_1.responseSuccess)(res, users, 'Lấy danh sách người dùng thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserController.getUserById(req.params.id);
        return (0, responseHandler_1.responseSuccess)(res, user, 'Lấy thông tin người dùng thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.NOT_FOUND, err.message);
    }
}));
router.get('/email/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserController.getUserByEmail(req.params.email);
        return (0, responseHandler_1.responseSuccess)(res, user, 'Lấy theo email thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.NOT_FOUND, err.message);
    }
}));
router.get('/token/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserController.getUserByToken(req.params.token);
        return (0, responseHandler_1.responseSuccess)(res, user, 'Lấy theo token thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.NOT_FOUND, err.message);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield UserController.createUser(req.body);
        return (0, responseHandler_1.responseSuccess)(res, newUser, 'Tạo người dùng thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield UserController.updateUser(req.params.id, req.body);
        return (0, responseHandler_1.responseSuccess)(res, updatedUser, 'Cập nhật thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield UserController.deleteUser(req.params.id);
        return (0, responseHandler_1.responseSuccess)(res, deletedUser, 'Xoá người dùng thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.NOT_FOUND, err.message);
    }
}));
exports.default = router;
