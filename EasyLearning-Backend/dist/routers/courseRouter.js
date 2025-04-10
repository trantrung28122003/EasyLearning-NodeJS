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
const CourseController = __importStar(require("../controllers/courseController"));
const constants = __importStar(require("../utils/constants"));
const responseHandler_1 = require("../utils/responseHandler");
const uploadCloudinaryHandler_1 = require("../utils/uploadCloudinaryHandler");
const authen_1 = require("../utils/authen");
const multer_1 = __importDefault(require("multer"));
const httpCode_1 = require("../enums/httpCode");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield CourseController.getAllCourses();
        return (0, responseHandler_1.responseSuccess)(res, courses, 'Lấy danh sách course thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/my-courses', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const events = yield CourseController.getCoursesByUser(user._id);
        (0, responseHandler_1.responseSuccess)(res, events, 'Lấy khóa học của bạn thành công');
    }
    catch (err) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy khóa học');
    }
}));
router.post('/', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let imageUrl = "https://res.cloudinary.com/dofr3xzmi/image/upload/v1744162084/elearning/vworklvnsvwrfdrtcnbs.jpg";
        if (req.file)
            imageUrl = yield (0, uploadCloudinaryHandler_1.handleImageUpload)(req.file);
        const courseData = Object.assign(Object.assign({}, req.body), { imageUrl, categories: req.body.categories || [], createdBy: user._id, changedBy: user._id });
        const createdCourse = yield CourseController.createCourse(courseData);
        return (0, responseHandler_1.responseSuccess)(res, createdCourse, 'Tạo khoá học thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.put('/:courseId', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { courseId } = req.params;
        let imageUrl;
        if (req.file) {
            imageUrl = yield (0, uploadCloudinaryHandler_1.handleImageUpload)(req.file);
        }
        const courseData = Object.assign(Object.assign({}, req.body), { imageUrl, categories: req.body.categories || [], changedBy: user._id });
        const updateCourse = yield CourseController.updateCourse(courseId, courseData);
        return (0, responseHandler_1.responseSuccess)(res, updateCourse, 'Sửa khoá học thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete('/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CourseController.deleteCourse(req.params.categoryId);
        return (0, responseHandler_1.responseSuccess)(res, null, 'Xoá course thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete('/soft-delete/:courseId', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CourseController.softDeleteCourse(req.params.courseId);
        return (0, responseHandler_1.responseSuccess)(res, null, 'Xoá mềm course thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
exports.default = router;
