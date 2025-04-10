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
const courseController_1 = __importStar(require("../controllers/courseController")), CourseController = courseController_1;
const CategoryController = __importStar(require("../controllers/categoryController"));
const responseHandler_1 = require("../utils/responseHandler");
const httpCode_1 = require("../enums/httpCode");
const router = (0, express_1.Router)();
router.get('/topFourMostRegisteredCourses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CourseController.getTopFourMostRegisteredCourses();
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/topFourMostCategory', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CategoryController.findTop4BySortOrderNotNull();
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/getAllCourse', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CourseController.getAllCourses();
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/getAllCategoryWithCourse', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CategoryController.getAllCategoryWithCourse();
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/getCategoryWithCourse/:categoryId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const result = yield CategoryController.getCategoryWithCourse(categoryId);
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/getCourseWithDiscount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CourseController.getAllCourseWithDiscount();
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/getCourseWithFree', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CourseController.getCourseWithFree();
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/detail/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const result = yield courseController_1.default.getDetailCourse(courseId);
        return (0, responseHandler_1.responseSuccess)(res, result);
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
// router.get('/getFeedbacksByCourseWithoutUser/:courseId', async (req: Request, res: Response) => {
//   try {
//     const result = await FeedbackController.getFeedbacksByCourseWithoutUser(req.params.courseId);
//     return responseSuccess(res, result);
//   } catch (err: any) {
//     return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
//   }
// });
// router.get('/getFeedbacksWithFiveRating', async (req: Request, res: Response) => {
//   try {
//     const result = await FeedbackController.getFeedbacksWithFiveRating();
//     return responseSuccess(res, result);
//   } catch (err: any) {
//     return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
//   }
// });
// router.get('/search', async (req: Request, res: Response) => {
//   try {
//     const { query, sortBy, courseType, rating } = req.query;
//     const result = await CourseController.searchCourses(query as string, sortBy as string, courseType as string, rating ? Number(rating) : undefined);
//     return responseSuccess(res, result);
//   } catch (err: any) {
//     return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
//   }
// });
exports.default = router;
