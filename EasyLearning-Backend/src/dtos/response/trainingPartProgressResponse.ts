
export interface TrainingPartProgressResponse {
    id: string;
    trainingPartName: string;
    startTime: string;  
    endTime: string;  
    dateChange: string;  
    description: string;
    trainingPartType: string;  
    imageUrl: string;
    videoUrl: string;
    isFree: boolean;
    courseId: string;
    courseEventId: string;
    isDeleted: boolean;
    completed: boolean;
    watchedDuration: number;
    quizScore: number;
}
