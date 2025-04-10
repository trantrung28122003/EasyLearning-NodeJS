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
exports.deleteTrainingPart = exports.softDeleteTrainingPart = exports.updateTrainingPart = exports.createTrainingPart = exports.getTrainingPartsByCourseId = exports.getTrainingPartsByUser = exports.getAllTrainingParts = void 0;
const trainingPart_1 = __importDefault(require("../models/trainingPart"));
const trainingPartType_enum_1 = require("../enums/trainingPartType.enum");
const mongoose_1 = require("mongoose");
const getAllTrainingParts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield trainingPart_1.default.find({ isDeleted: false });
});
exports.getAllTrainingParts = getAllTrainingParts;
const getTrainingPartsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield trainingPart_1.default.find({ createdBy: userId, isDeleted: false });
});
exports.getTrainingPartsByUser = getTrainingPartsByUser;
const getTrainingPartsByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield trainingPart_1.default.find({
        course: courseId,
        isDeleted: false,
    }).sort({ startTime: 1 });
});
exports.getTrainingPartsByCourseId = getTrainingPartsByCourseId;
const createTrainingPart = (courseId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const newTrainingPart = new trainingPart_1.default({
        trainingPartName: data.trainingPartName,
        startTime: data.startTime ? new Date(data.startTime) : new Date(),
        endTime: data.endTime ? new Date(data.endTime) : new Date(),
        description: data.description || "",
        trainingPartType: data.trainingPartType,
        imageUrl: data.imageUrl || "",
        videoUrl: data.videoUrl || "",
        isFree: data.isFree,
        course: new mongoose_1.Types.ObjectId(courseId),
        courseEvent: new mongoose_1.Types.ObjectId(data.courseEventId),
        createdBy: data.createdBy,
        changedBy: data.changedBy || "SYSTEM",
        userTrainingProgress: [],
        comments: [],
        exerciseQuestions: [],
    });
    const savedTrainingPart = yield newTrainingPart.save();
    return savedTrainingPart;
});
exports.createTrainingPart = createTrainingPart;
const updateTrainingPart = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const trainingPart = yield trainingPart_1.default.findById(id);
    if (!trainingPart || trainingPart.isDeleted) {
        throw new Error("Phần học không tồn tại");
    }
    trainingPart.trainingPartName = (_a = data.trainingPartName) !== null && _a !== void 0 ? _a : trainingPart.trainingPartName;
    if (data.trainingPartType && Object.values(trainingPartType_enum_1.TrainingPartType).includes(data.trainingPartType)) {
        trainingPart.trainingPartType = data.trainingPartType;
    }
    trainingPart.description = (_b = data.description) !== null && _b !== void 0 ? _b : trainingPart.description;
    trainingPart.startTime = data.startTime ? new Date(data.startTime) : trainingPart.startTime;
    trainingPart.endTime = data.endTime ? new Date(data.endTime) : trainingPart.endTime;
    trainingPart.imageUrl = (_c = data.imageUrl) !== null && _c !== void 0 ? _c : trainingPart.imageUrl;
    trainingPart.videoUrl = (_d = data.videoUrl) !== null && _d !== void 0 ? _d : trainingPart.videoUrl;
    trainingPart.isFree = (_e = data.isFree) !== null && _e !== void 0 ? _e : trainingPart.isFree;
    trainingPart.changedBy = data.changedBy || trainingPart.changedBy;
    const updated = yield trainingPart.save();
    return updated;
});
exports.updateTrainingPart = updateTrainingPart;
const softDeleteTrainingPart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const trainingPart = yield trainingPart_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!trainingPart)
        throw new Error("Phần học không tồn tại");
    return trainingPart;
});
exports.softDeleteTrainingPart = softDeleteTrainingPart;
const deleteTrainingPart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const trainingPart = yield trainingPart_1.default.findByIdAndDelete(id);
    if (!trainingPart)
        throw new Error("Phần học không tồn tại");
    return trainingPart;
});
exports.deleteTrainingPart = deleteTrainingPart;
