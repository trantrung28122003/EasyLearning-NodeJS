import { Course, CoursesDetail } from "./Course";


export interface CategoryWithCourse  {
  id: string;
  categoryName: string;
  courses: Course[];
}

export interface Category {
  id: string;
  categoryName: string;
  imageLink: string;
  sortOrder: number;
  dateCreate: string;
  dateChange: string;
  changedBy: string;
  coursesDetails: CoursesDetail[];
  deleted: boolean;
}
