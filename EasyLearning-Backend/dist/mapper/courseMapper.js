"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCourseResponse = void 0;
const toCourseResponse = (course) => ({
    id: course._id.toString(),
    courseName: course.courseName,
    courseDescription: course.courseDescription,
    coursePrice: course.coursePrice,
    imageUrl: course.imageUrl,
    instructor: course.instructor,
    courseType: course.courseType,
    startDate: course.startDate,
    endDate: course.endDate,
    isFree: course.isFree,
    registeredUsers: course.registeredUsers,
});
exports.toCourseResponse = toCourseResponse;
