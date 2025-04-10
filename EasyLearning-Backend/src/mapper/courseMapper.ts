import { ICourse } from '../models/course';
import { CourseResponse } from '../dtos/response/courseReponse';

export const toCourseResponse = (course: ICourse): CourseResponse => ({
  id: course._id!.toString(),
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
