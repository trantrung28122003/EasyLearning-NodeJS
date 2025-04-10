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
exports.deleteCourse = exports.softDeleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getCoursesByUser = exports.getCourseWithFree = exports.getAllCourseWithDiscount = exports.getTopFourMostRegisteredCourses = exports.getAllCourses = void 0;
const course_1 = __importDefault(require("../models/course"));
const courseDetailController_1 = require("./courseDetailController");
const category_1 = __importDefault(require("../models/category"));
const courseType_enum_1 = require("../enums/courseType.enum");
const courseDiscount_1 = __importDefault(require("../models/courseDiscount"));
const FeebackController = __importStar(require("../controllers/feedbackController"));
const TrainingPartController = __importStar(require("../controllers/trainingPartController"));
const CourseEventControler = __importStar(require("../controllers/courseEventController"));
const DiscountController = __importStar(require("../controllers/discountController"));
const mongoose_1 = require("mongoose");
const getAllCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_1.default.find({ isDeleted: false });
});
exports.getAllCourses = getAllCourses;
const getTopFourMostRegisteredCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_1.default.find()
        .sort({ registeredUsers: -1 })
        .limit(4);
});
exports.getTopFourMostRegisteredCourses = getTopFourMostRegisteredCourses;
const getAllCourseWithDiscount = () => __awaiter(void 0, void 0, void 0, function* () {
    const courseIds = yield courseDiscount_1.default.distinct('courseId');
    const courses = yield course_1.default.find({ _id: { $in: courseIds } });
    return courses;
});
exports.getAllCourseWithDiscount = getAllCourseWithDiscount;
const getCourseWithFree = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_1.default.find({ isFree: true, isDeleted: false });
});
exports.getCourseWithFree = getCourseWithFree;
const getCoursesByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield course_1.default.find({ createdBy: userId, isDeleted: false });
});
exports.getCoursesByUser = getCoursesByUser;
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_1.default.findById(id);
    if (!course || course.isDeleted)
        throw new Error('Khoá học không tồn tại');
    return course;
});
exports.getCourseById = getCourseById;
const createCourse = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newCourse = new course_1.default({
        courseName: data.courseName,
        courseDescription: data.courseDescription || '',
        coursePrice: data.coursePrice || 0,
        requirements: data.requirements || '',
        courseType: data.courseType || '',
        courseContent: data.courseContent || '',
        instructor: data.instructor || '',
        startDate: data.startDate,
        endDate: data.endDate,
        isFree: data.isFree,
        imageUrl: data.imageUrl || '',
        registrationDeadline: data.registrationDeadline,
        maxAttendees: data.maxAttendees || 0,
        registeredUsers: data.registeredUsers || 0,
        changedBy: data.changedBy || 'SYSTEM',
    });
    const createCourse = yield newCourse.save();
    const validCategories = yield category_1.default.find({
        _id: { $in: data.categories },
        isDeleted: false
    }).select('_id');
    const validCategoryIds = validCategories.map(c => c._id.toString());
    if (createCourse._id && data.categories && validCategoryIds.length > 0) {
        yield (0, courseDetailController_1.createCourseDetail)(createCourse._id.toString(), validCategoryIds, data.changedBy);
    }
    return createCourse;
});
exports.createCourse = createCourse;
const updateCourse = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const course = yield course_1.default.findById(id);
    if (!course || course.isDeleted)
        throw new Error('Khoá học không tồn tại');
    course.courseName = (_a = data.courseName) !== null && _a !== void 0 ? _a : course.courseName;
    course.courseDescription = (_b = data.courseDescription) !== null && _b !== void 0 ? _b : course.courseDescription;
    course.coursePrice = (_c = data.coursePrice) !== null && _c !== void 0 ? _c : course.coursePrice;
    course.requirements = (_d = data.requirements) !== null && _d !== void 0 ? _d : course.requirements;
    if (data.courseType && Object.values(courseType_enum_1.CourseType).includes(data.courseType)) {
        course.courseType = data.courseType;
    }
    course.courseContent = (_e = data.courseContent) !== null && _e !== void 0 ? _e : course.courseContent;
    course.instructor = (_f = data.instructor) !== null && _f !== void 0 ? _f : course.instructor;
    course.startDate = new Date((_g = data.startDate) !== null && _g !== void 0 ? _g : course.startDate);
    course.endDate = new Date((_h = data.endDate) !== null && _h !== void 0 ? _h : course.endDate);
    course.registrationDeadline = new Date((_j = data.registrationDeadline) !== null && _j !== void 0 ? _j : course.registrationDeadline);
    course.maxAttendees = (_k = data.maxAttendees) !== null && _k !== void 0 ? _k : course.maxAttendees;
    course.registeredUsers = (_l = data.registeredUsers) !== null && _l !== void 0 ? _l : course.registeredUsers;
    course.isFree = (_m = data.isFree) !== null && _m !== void 0 ? _m : course.isFree,
        course.changedBy = data.changedBy || 'SYSTEM';
    course.imageUrl = (_o = data.imageUrl) !== null && _o !== void 0 ? _o : course.imageUrl;
    const updatedCourse = yield course.save();
    const validCategories = yield category_1.default.find({
        _id: { $in: data.categories },
        isDeleted: false
    }).select('_id');
    const validCategoryIds = validCategories.map(c => c._id.toString());
    if (updatedCourse._id && data.categories && validCategoryIds.length > 0) {
        yield (0, courseDetailController_1.deleteByCourseId)(updatedCourse._id.toString());
        yield (0, courseDetailController_1.createCourseDetail)(id, validCategoryIds, data.changedBy);
    }
    const updateCourse = yield course.save();
    return updateCourse;
});
exports.updateCourse = updateCourse;
const softDeleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!course)
        throw new Error('Khoá học không tồn tại');
    (0, courseDetailController_1.softDeleteDetailByCourseId)(course._id.toString());
    return course;
});
exports.softDeleteCourse = softDeleteCourse;
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_1.default.findByIdAndDelete(id);
    if (!course)
        throw new Error('Khoá học không tồn tại');
    return course;
});
exports.deleteCourse = deleteCourse;
const getDetailCourse = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const course = yield course_1.default.findById(courseId)
            .populate('learningOutcomes')
            .exec();
        if (!course) {
            throw new Error(`Không tìm thấy khóa học với: ${courseId}`);
        }
        const trainingParts = yield TrainingPartController.getTrainingPartsByCourseId(course._id.toString());
        const feedbackReponse = yield FeebackController.getFeedbacksForCoursePublic(course._id.toString());
        let totalFeedback = feedbackReponse.feedbacks.length;
        let averageRating = 0;
        if (totalFeedback > 0) {
            const totalRating = feedbackReponse.feedbacks.reduce((sum, feedback) => sum + feedback.feedbackRating, 0);
            averageRating = totalRating / totalFeedback;
        }
        let courseEventResponses = [];
        for (const trainingPart of trainingParts) {
            const courseEvent = yield CourseEventControler.getCourseEventsById(trainingPart.courseEvent._id.toString());
            if (courseEvent) {
                const courseEventResponse = {
                    id: courseEvent._id.toString(),
                    courseEventName: courseEvent.eventName,
                    location: courseEvent.location,
                    startTime: courseEvent.dateStart.toString(),
                    endTime: courseEvent.dateEnd.toString(),
                    trainingParts: [trainingPart],
                    totalPartsByCourseEvent: trainingParts.filter(p => {
                        const courseEventId = p.courseEvent._id;
                        const courseEventObjectId = new mongoose_1.Types.ObjectId(courseEvent._id);
                        return courseEventId.equals(courseEventObjectId);
                    }).length
                };
                if (!courseEventResponses.some(p => p.id === courseEventResponse.id)) {
                    courseEventResponses.push(courseEventResponse);
                }
            }
        }
        courseEventResponses = courseEventResponses.sort((a, b) => {
            const startTimeA = new Date(a.startTime).getTime();
            const startTimeB = new Date(b.startTime).getTime();
            return startTimeA - startTimeB;
        });
        const totalLearningTime = calculateTotalLearningTime(courseEventResponses);
        const coursePriceDiscount = yield DiscountController.applyCourseDiscount(courseId, course.coursePrice);
        const finalPrice = coursePriceDiscount || course.coursePrice;
        const detailCourseResponse = {
            courseId: course._id,
            courseName: course.courseName,
            coursePrice: course.coursePrice,
            coursePriceDiscount: finalPrice,
            courseImage: course.imageUrl,
            nameInstructor: course.instructor,
            courseEventResponses,
            totalFeedback,
            averageRating,
            feedFeedbackInfoResponses: feedbackReponse.feedbacks,
            totalLearningTime,
            learningOutcomes: course.learningOutcomes,
            nextAvailableDate: (_a = course.nextAvailableDate) === null || _a === void 0 ? void 0 : _a.toString(),
        };
        return detailCourseResponse;
    }
    catch (error) {
        throw new Error(`Error fetching course details: ${error.message}`);
    }
});
const calculateTotalLearningTime = (courseEventResponses) => {
    return courseEventResponses.reduce((totalTime, event) => {
        const startTime = new Date(event.startTime).getTime();
        const endTime = new Date(event.endTime).getTime();
        return totalTime + (endTime - startTime);
    }, 0);
};
exports.default = { getDetailCourse };
