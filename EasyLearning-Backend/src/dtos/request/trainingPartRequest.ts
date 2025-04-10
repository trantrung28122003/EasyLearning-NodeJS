export interface TrainingPartRequest {
    trainingPartName: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    trainingPartType: string;
    imageUrl?: string;
    videoUrl?: string;
    isFree: boolean;
    courseEventId?: string;
    createdBy: string;
    changedBy?: string;
}
