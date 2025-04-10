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
const express_1 = require("express");
const responseHandler_1 = require("../utils/responseHandler");
const httpCode_1 = require("../enums/httpCode");
const CourseEventController = __importStar(require("../controllers/courseEventController"));
const constants = __importStar(require("../utils/constants"));
const authen_1 = require("../utils/authen");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseEvents = yield CourseEventController.getAllCourseEvents();
        (0, responseHandler_1.responseSuccess)(res, courseEvents, 'Lấy danh sách CourseEvent thành công');
    }
    catch (err) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy danh sách CourseEvent');
    }
}));
router.get('/my-events', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const events = yield CourseEventController.getCourseEventsByUser(user._id);
        (0, responseHandler_1.responseSuccess)(res, events, 'Lấy buổi học của bạn thành công');
    }
    catch (err) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy buổi học');
    }
}));
router.post('/', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const courseEvent = Object.assign(Object.assign({}, req.body), { createdBy: user._id, changedBy: user._id });
        const createCourseEvent = yield CourseEventController.createCourseEvent(courseEvent);
        (0, responseHandler_1.responseSuccess)(res, createCourseEvent, 'Tạo buổi học thành công');
    }
    catch (err) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, 'Không thể tạo buổi học');
    }
}));
router.put('/:id', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const updateData = Object.assign(Object.assign({}, req.body), { changeBy: user._id });
        const updated = yield CourseEventController.updateCourseEvent(req.params.id, updateData);
        if (!updated) {
            return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.NOT_FOUND, 'Buổi học không tồn tại hoặc đã bị xoá');
        }
        (0, responseHandler_1.responseSuccess)(res, updated, 'Cập nhật buổi học thành công');
    }
    catch (err) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, 'Không thể cập nhật buổi học');
    }
}));
router.delete('/:courseEventId', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CourseEventController.deleteCourseEvent(req.params.courseEventId);
        return (0, responseHandler_1.responseSuccess)(res, null, 'Xoá coursEvent thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete('/soft-delete/:courseEventId', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield CourseEventController.softDeleteCourseEvent(req.params.courseEventId);
        return (0, responseHandler_1.responseSuccess)(res, null, 'Xoá mềm coursEvent thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
exports.default = router;
