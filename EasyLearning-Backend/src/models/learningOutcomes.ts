import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILearningOutcomes extends Document {
    outcomeName: string;
    course: Types.ObjectId;
    changedBy?: string;
    isDeleted: boolean;
}

const learningOutcomesSchema: Schema<ILearningOutcomes> = new Schema({
        outcomeName: { type: String, required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        changedBy: { type: String},
        isDeleted: { type: Boolean, default: false },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<ILearningOutcomes>('LearningOutcomes', learningOutcomesSchema);
