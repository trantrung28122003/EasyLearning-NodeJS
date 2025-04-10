export interface CourseResponse {
    id: string;
    courseName: string;
    courseDescription: string;
    coursePrice: number;
    imageUrl: string;
    instructor: string;
    courseType: string;
    startDate: Date;
    endDate: Date;
    isFree: boolean;
    registeredUsers: number;
  }