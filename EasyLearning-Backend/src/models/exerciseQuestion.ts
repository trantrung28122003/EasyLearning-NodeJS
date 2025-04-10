import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IExerciseQuestion extends Document {
    title: string;
    question: string;
    description?: string;
    changedBy?: string;
    isDeleted: boolean;
    trainingPart: Types.ObjectId;
    answers: Types.ObjectId[];
}

const exerciseQuestionSchema: Schema<IExerciseQuestion> = new Schema({
        title: { type: String, required: true },
        question: { type: String, required: true },
        description: { type: String },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false },
        trainingPart: { type: Schema.Types.ObjectId, ref: 'TrainingPart', required: true }, 
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IExerciseQuestion>('ExerciseQuestion', exerciseQuestionSchema);
