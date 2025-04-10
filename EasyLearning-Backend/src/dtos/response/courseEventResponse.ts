
import { ITrainingPart } from 'src/models/trainingPart';
import { TrainingPartProgressResponse } from './trainingPartProgressResponse';

export interface CourseEventResponse {
    id: string;
    courseEventName: string;
    startTime: string;  
    endTime: string;  
    location: string;
    completedPartsByCourseEvent?: number;
    totalPartsByCourseEvent?: number;
    trainingParts?: ITrainingPart[];
    trainingPartProgressResponses?: TrainingPartProgressResponse[];
}
