import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './user';
import { ICourse } from './course';


export interface IFeedback extends Document {
    course: ICourse | Types.ObjectId;
    user: IUser | Types.ObjectId;
    feedbackContent: string;
    feedbackRating: number;
    changedBy?: string;
    isDeleted: boolean;
    createdAt?: Date; 
    updatedAt?: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema({
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        feedbackContent: { type: String, required: true },
        feedbackRating: { type: Number, required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false },
    }, 
    { 
        timestamps: true 
    });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
