"use strict";
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
exports.deleteByCategoryId = exports.deleteByCourseId = exports.softDeleteDetailByCategoryId = exports.softDeleteDetailByCourseId = exports.createCourseDetail = void 0;
const courseDetail_1 = __importDefault(require("../models/courseDetail"));
const createCourseDetail = (courseId_1, categoryIds_1, ...args_1) => __awaiter(void 0, [courseId_1, categoryIds_1, ...args_1], void 0, function* (courseId, categoryIds, changedBy = 'SYSTEM') {
    const courseDetails = categoryIds.map(categoryId => ({
        course: courseId,
        category: categoryId,
        changedBy,
        isDeleted: false
    }));
    return yield courseDetail_1.default.insertMany(courseDetails);
});
exports.createCourseDetail = createCourseDetail;
const softDeleteDetailByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    yield courseDetail_1.default.updateMany({ course: courseId }, { isDeleted: true });
});
exports.softDeleteDetailByCourseId = softDeleteDetailByCourseId;
const softDeleteDetailByCategoryId = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    yield courseDetail_1.default.updateMany({ category: categoryId }, { isDeleted: true });
});
exports.softDeleteDetailByCategoryId = softDeleteDetailByCategoryId;
const deleteByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    yield courseDetail_1.default.deleteMany({ course: courseId });
});
exports.deleteByCourseId = deleteByCourseId;
const deleteByCategoryId = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    yield courseDetail_1.default.deleteMany({ category: categoryId });
});
exports.deleteByCategoryId = deleteByCategoryId;
