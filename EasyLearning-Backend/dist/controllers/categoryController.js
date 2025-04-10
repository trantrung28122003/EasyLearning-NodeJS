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
exports.deleteCategory = exports.softDeleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryWithCourse = exports.getAllCategoryWithCourse = exports.findTop4BySortOrderNotNull = exports.getCategoryById = exports.getAllCategories = void 0;
const courseMapper_1 = require("../mapper/courseMapper");
const category_1 = __importDefault(require("../models/category"));
const courseDetail_1 = __importDefault(require("../models/courseDetail"));
const course_1 = __importDefault(require("../models/course"));
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield category_1.default.find({ isDeleted: false });
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.default.findById(id);
    if (!category || category.isDeleted)
        throw new Error('Danh mục không tồn tại');
    return category;
});
exports.getCategoryById = getCategoryById;
const findTop4BySortOrderNotNull = () => __awaiter(void 0, void 0, void 0, function* () {
    const validSortOrders = [1, 2, 3, 4];
    const categories = yield category_1.default.find({
        sortOrder: { $in: validSortOrders }
    });
    return categories;
});
exports.findTop4BySortOrderNotNull = findTop4BySortOrderNotNull;
const getAllCategoryWithCourse = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_1.default.find();
    const result = [];
    for (const category of categories) {
        const courseDetails = yield courseDetail_1.default.find({ categoryId: category._id });
        const courseIds = courseDetails.map(p => p.course._id);
        const courses = yield course_1.default.find({ _id: { $in: courseIds } });
        const courseResponses = courses.map(courseMapper_1.toCourseResponse);
        result.push({
            id: category._id.toString(),
            categoryName: category.categoryName,
            courses: courseResponses
        });
    }
    return result;
});
exports.getAllCategoryWithCourse = getAllCategoryWithCourse;
const getCategoryWithCourse = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.default.findById(categoryId);
    if (!category) {
        return null;
    }
    const courseDetails = yield courseDetail_1.default.find({ categoryId: category._id });
    const courseIds = courseDetails.map(p => p.course._id);
    const courses = yield course_1.default.find({ _id: { $in: courseIds } });
    const courseResponses = courses.map(courseMapper_1.toCourseResponse);
    return {
        id: category._id.toString(),
        categoryName: category.categoryName,
        courses: courseResponses
    };
});
exports.getCategoryWithCourse = getCategoryWithCourse;
const createCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newCategory = new category_1.default({
        categoryName: data.categoryName,
        imageUrl: data.imageUrl || '',
        sortOrder: data.sortOrder || 0,
        changedBy: data.changedBy || 'SYSTEM',
        isDeleted: false,
    });
    return yield newCategory.save();
});
exports.createCategory = createCategory;
const updateCategory = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const category = yield category_1.default.findById(id);
    if (!category || category.isDeleted)
        throw new Error('Danh mục không tồn tại');
    category.categoryName = (_a = data.categoryName) !== null && _a !== void 0 ? _a : category.categoryName;
    category.imageUrl = (_b = data.imageUrl) !== null && _b !== void 0 ? _b : category.imageUrl;
    category.sortOrder = (_c = data.sortOrder) !== null && _c !== void 0 ? _c : category.sortOrder;
    category.changedBy = data.changedBy || 'SYSTEM';
    return yield category.save();
});
exports.updateCategory = updateCategory;
const softDeleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!category)
        throw new Error('Danh mục không tồn tại');
    return category;
});
exports.softDeleteCategory = softDeleteCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.default.findByIdAndDelete(id);
    if (!category)
        throw new Error('Danh mục không tồn tại');
    return category;
});
exports.deleteCategory = deleteCategory;
