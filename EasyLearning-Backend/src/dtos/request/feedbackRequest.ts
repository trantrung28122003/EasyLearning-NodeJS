export interface FeedbackRequest {
    courseId: string;
    userId: string;
    feedbackContent: string;
    feedbackRating: number;
}