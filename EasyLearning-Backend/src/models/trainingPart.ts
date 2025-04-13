import { TrainingPartType } from '../enums/trainingPartType.enum';
import mongoose, { Schema, Document, Types } from 'mongoose';


export interface ITrainingPart extends Document {
    trainingPartName: string;
    startTime: Date;
    endTime: Date;
    description: string;
    trainingPartType: TrainingPartType;
    imageUrl: string;
    videoUrl: string;
    isFree: boolean;
    course: Types.ObjectId;
    courseEvent: Types.ObjectId;
    userTrainingProgress: Types.ObjectId[];
    comments: Types.ObjectId[];
    exerciseQuestions: Types.ObjectId[];
    createdBy:string;
    changedBy?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const trainingPartSchema: Schema<ITrainingPart> = new Schema({
        trainingPartName: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        description: { type: String },
        trainingPartType: { type: String, enum: Object.values(TrainingPartType), required: true },
        imageUrl: { type: String },
        videoUrl: { type: String },
        isFree: { type: Boolean, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        courseEvent: { type: Schema.Types.ObjectId, ref: 'CourseEvent', required: true },
        userTrainingProgress: [{ type: Schema.Types.ObjectId, ref: 'UserTrainingProgress' }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        exerciseQuestions: [{ type: Schema.Types.ObjectId, ref: 'ExerciseQuestion' }],
        createdBy: { type: String, required: true },
        changedBy: { type: String},
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<ITrainingPart>('TrainingPart', trainingPartSchema);
