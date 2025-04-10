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
exports.getFeedbacksForCoursePublic = exports.getFeedbackForCourse = exports.updateFeedback = exports.createFeedback = void 0;
const feedback_1 = __importDefault(require("../models/feedback"));
const feedbackMapper_1 = require("../mapper/feedbackMapper");
const mongoose_1 = require("mongoose");
const createFeedback = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newFeedback = new feedback_1.default({
        feedbackContent: data.feedbackContent,
        feedbackRating: data.feedbackRating,
        user: new mongoose_1.Types.ObjectId(data.userId),
        course: new mongoose_1.Types.ObjectId(data.courseId),
    });
    const savedFeedback = yield newFeedback.save();
    return savedFeedback;
});
exports.createFeedback = createFeedback;
const updateFeedback = (feedbackId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedback = yield feedback_1.default.findById(feedbackId);
        if (!feedback) {
            throw new Error('Không tìm thấy đánh giá phản hồi');
        }
        feedback.feedbackContent = data.feedbackContent || feedback.feedbackContent;
        feedback.feedbackRating = data.feedbackRating || feedback.feedbackRating;
        feedback.user = data.userId ? new mongoose_1.Types.ObjectId(data.userId) : feedback.user;
        feedback.course = data.courseId ? new mongoose_1.Types.ObjectId(data.courseId) : feedback.course;
        const updatedFeedback = yield feedback.save();
        return updatedFeedback;
    }
    catch (err) {
        throw new Error(err.message || 'Cập nhật đánh giá thất bại');
    }
});
exports.updateFeedback = updateFeedback;
const getFeedbackForCourse = (courseId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield feedback_1.default.find({ course: courseId, isDeleted: false });
    const hasGivenFeedback = feedbacks.some((feedback) => {
        const userId = feedback.user instanceof mongoose_1.Types.ObjectId
            ? feedback.user
            : feedback.user._id;
        return userId.equals(new mongoose_1.Types.ObjectId(currentUserId));
    });
    const feedbackInfos = yield Promise.all(feedbacks.map(feedbackMapper_1.toFeedbackInfoResponse));
    const feedbackResponse = {
        feedbacks: feedbackInfos,
        hasGivenFeedback
    };
    return feedbackResponse;
});
exports.getFeedbackForCourse = getFeedbackForCourse;
const getFeedbacksForCoursePublic = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield feedback_1.default.find({
        course: courseId,
        isDeleted: false
    });
    const feedbackInfos = yield Promise.all(feedbacks.map(feedbackMapper_1.toFeedbackInfoResponse));
    const feedbackResponse = {
        feedbacks: feedbackInfos,
        hasGivenFeedback: false
    };
    return feedbackResponse;
});
exports.getFeedbacksForCoursePublic = getFeedbacksForCoursePublic;
