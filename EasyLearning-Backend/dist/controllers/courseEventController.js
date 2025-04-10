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
exports.deleteCourseEvent = exports.softDeleteCourseEvent = exports.updateCourseEvent = exports.createCourseEvent = exports.getCourseEventsById = exports.getCourseEventsByUser = exports.getAllCourseEvents = void 0;
const courseEvent_1 = __importDefault(require("../models/courseEvent"));
const courseEventType_enum_1 = require("../enums/courseEventType.enum");
const getAllCourseEvents = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield courseEvent_1.default.find({ isDeleted: false });
});
exports.getAllCourseEvents = getAllCourseEvents;
const getCourseEventsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield courseEvent_1.default.find({ createdBy: userId, isDeleted: false });
});
exports.getCourseEventsByUser = getCourseEventsByUser;
const getCourseEventsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEvent = yield courseEvent_1.default.findById(id);
    if (!courseEvent || courseEvent.isDeleted)
        throw new Error('Buổi học không tồn tại');
    return courseEvent;
});
exports.getCourseEventsById = getCourseEventsById;
const createCourseEvent = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newCourseEvent = new courseEvent_1.default(Object.assign({}, data));
    const savedCourseEvent = yield newCourseEvent.save();
    return savedCourseEvent;
});
exports.createCourseEvent = createCourseEvent;
const updateCourseEvent = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const courseEvent = yield courseEvent_1.default.findById(id);
    if (!courseEvent || courseEvent.isDeleted) {
        throw new Error('Buổi học không tồn tại');
    }
    courseEvent.eventName = (_a = data.eventName) !== null && _a !== void 0 ? _a : courseEvent.eventName;
    if (data.eventType && Object.values(courseEventType_enum_1.CourseEventType).includes(data.eventType)) {
        courseEvent.eventType = data.eventType;
    }
    courseEvent.location = (_b = data.location) !== null && _b !== void 0 ? _b : courseEvent.location;
    courseEvent.dateStart = data.dateStart ? new Date(data.dateStart) : courseEvent.dateStart;
    courseEvent.dateEnd = data.dateEnd ? new Date(data.dateEnd) : courseEvent.dateEnd;
    const updated = yield courseEvent.save();
    return updated;
});
exports.updateCourseEvent = updateCourseEvent;
const softDeleteCourseEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEvent = yield courseEvent_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!courseEvent)
        throw new Error('Buổi học không tồn tại');
    return courseEvent;
});
exports.softDeleteCourseEvent = softDeleteCourseEvent;
const deleteCourseEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courseEvent = yield courseEvent_1.default.findByIdAndDelete(id);
    if (!courseEvent)
        throw new Error('Buổi học không tồn tại');
    return courseEvent;
});
exports.deleteCourseEvent = deleteCourseEvent;
