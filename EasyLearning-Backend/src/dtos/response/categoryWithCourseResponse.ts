import { CourseResponse } from "./courseReponse";

export interface CategoryWithCourseResponse {
    id: string;
    categoryName: string;
    courses: CourseResponse[];
}