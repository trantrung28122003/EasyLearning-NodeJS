export interface FeedbackInfoResponse {
    id: string;
    courseId: string;
    userId: string;
    typeUser?:string;
    avatar: string;
    fullName: string;
    content: string;
    feedbackRating: number;
    createdAt: string;
}
  
export interface FeedbackResponse {
    feedbacks: FeedbackInfoResponse[];
    hasGivenFeedback: boolean;
}