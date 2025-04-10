import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAnswer extends Document {
    content: string;
    isCorrect: boolean;
    changedBy?: string;
    isDeleted: boolean;
    exerciseQuestion: Types.ObjectId;
}

const answerSchema: Schema<IAnswer> = new Schema({
    content: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    changedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
    exerciseQuestion: { type: Schema.Types.ObjectId, ref: 'ExerciseQuestion', required: true }, 
    }, 
    { 
        timestamps: true 
    }
);

export default mongoose.model<IAnswer>('Answer', answerSchema);
