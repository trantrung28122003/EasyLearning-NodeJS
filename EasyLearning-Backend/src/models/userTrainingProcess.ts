import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserTrainingProgress extends Document {
    trainingPart: Types.ObjectId;
    user: Types.ObjectId;
    watchedDuration: number;
    quizScore: number;
    isCompleted: boolean;
    changedBy?: string;
    isDeleted: boolean;
}

const userTrainingProgressSchema: Schema<IUserTrainingProgress> = new Schema({
        trainingPart: { type: Schema.Types.ObjectId, ref: 'TrainingPart', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        watchedDuration: { type: Number, required: true },
        quizScore: { type: Number, required: true },
        isCompleted: { type: Boolean, required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false },
    }, 
    { 
        timestamps: true 
    }
);

export default mongoose.model<IUserTrainingProgress>('UserTrainingProgress', userTrainingProgressSchema);
