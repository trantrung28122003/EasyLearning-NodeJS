
export interface Feedback {
  feedbackId: string;
  userId: string;
  fullName: string;
  typeUser:string;
  avatar: string;
  content: string;
  feedbackRating: number;
  dateCreate: string;
  dateChange: string;
  changedBy: string;
  courseId: string;
  deleted: boolean;
}
