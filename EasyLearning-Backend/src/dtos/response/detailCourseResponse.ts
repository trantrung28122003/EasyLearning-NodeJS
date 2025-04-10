import { ILearningOutcomes } from 'src/models/learningOutcomes';
import { CourseEventResponse } from './courseEventResponse';
import { FeedbackInfoResponse } from './feefbackResponse';
import { Types } from 'mongoose';


export interface DetailCourseResponse {
    courseId: string;
    courseName: string;
    courseImage: string;
    nameInstructor: string;
    coursePrice: number;  
    coursePriceDiscount?: number;  
    totalLearningTime: number;
    nextAvailableDate?: string; 
    totalFeedback: number;
    averageRating: number;
    learningOutcomes: (ILearningOutcomes | Types.ObjectId)[];
    courseEventResponses: CourseEventResponse[];
    feedFeedbackInfoResponses?: FeedbackInfoResponse[];
}
