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
const CategoryController = __importStar(require("../controllers/categoryController"));
const constants = __importStar(require("../utils/constants"));
const responseHandler_1 = require("../utils/responseHandler");
const multer_1 = __importDefault(require("multer"));
const uploadCloudinaryHandler_1 = require("../utils/uploadCloudinaryHandler");
const authen_1 = require("../utils/authen");
const httpCode_1 = require("../enums/httpCode");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryController.getAllCategories();
        return (0, responseHandler_1.responseSuccess)(res, categories, 'Lấy danh sách category thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.post('/', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageUrl = yield (0, uploadCloudinaryHandler_1.handleImageUpload)(req.file);
        const category = yield CategoryController.createCategory(Object.assign(Object.assign({}, req.body), { imageUrl, isDeleted: false }));
        return (0, responseHandler_1.responseSuccess)(res, category, 'Tạo category thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.put('/:categoryId', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        let imageUrl;
        if (req.file) {
            imageUrl = yield (0, uploadCloudinaryHandler_1.handleImageUpload)(req.file);
        }
        const updatedCategory = yield CategoryController.updateCategory(categoryId, Object.assign(Object.assign({}, req.body), { imageUrl }));
        return (0, responseHandler_1.responseSuccess)(res, updatedCategory, 'Cập nhật category thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete('/:categoryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CategoryController.deleteCategory(req.params.categoryId);
        return (0, responseHandler_1.responseSuccess)(res, null, 'Xoá category thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete('/soft-delete/:categoryId', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CategoryController.softDeleteCategory(req.params.categoryId);
        return (0, responseHandler_1.responseSuccess)(res, null, 'Xoá mềm category thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
exports.default = router;
