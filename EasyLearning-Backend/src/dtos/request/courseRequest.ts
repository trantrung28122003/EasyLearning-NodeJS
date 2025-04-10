export interface CourseRequest {
    courseName: string;
    courseDescription: string;
    coursePrice: number;
    requirements: string;
    courseType: string;
    courseContent: string;
    instructor: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    categories: string[];
    maxAttendees: number;
    registeredUsers: number;
    isFree: boolean
    createdBy: string;
    changedBy?: string;
    imageUrl?: string;
}


export interface CourseSearchQuery {
  query?: string;
  sortBy?: string;
  courseType?: string;
  rating?: number;
}
  