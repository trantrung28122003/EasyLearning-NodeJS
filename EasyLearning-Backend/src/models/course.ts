import mongoose, { Schema, Document, Types } from 'mongoose';
import { CourseType } from '../enums/courseType.enum'; 
import { ILearningOutcomes } from './learningOutcomes';

export interface ICourse extends Document {
    courseName: string;
    courseDescription: string;
    coursePrice: number;
    requirements: string;
    courseType: CourseType;
    courseContent: string;
    imageUrl: string;
    instructor: string;
    startDate: Date;
    endDate: Date;
    registrationDeadline?: Date;
    nextAvailableDate?: Date;
    maxAttendees: number;
    registeredUsers: number;
    isFree: boolean;
    createdBy: string;
    changedBy?: string;
    isDeleted: boolean;
    coursesDetails: Types.ObjectId[];
    trainingParts: Types.ObjectId[];
    shoppingCartItems: Types.ObjectId[];
    orderDetails: Types.ObjectId[];
    feedbacks: Types.ObjectId[];
    addOns: Types.ObjectId[];
    userNotes: Types.ObjectId[];
    learningOutcomes: ILearningOutcomes[] | Types.ObjectId[];
    courseDiscounts: Types.ObjectId[];
    userFavorite: Types.ObjectId[];
}

const courseSchema: Schema<ICourse> = new Schema({
    courseName: { type: String, required: true },
    courseDescription: { type: String, required: true },
    coursePrice: { type: Number, required: true },
    requirements: { type: String, required: true },
    courseType: { type: String, enum: Object.values(CourseType), required: true },
    courseContent: { type: String, required: true },
    imageUrl: { type: String, required: true },
    instructor: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: false },
    nextAvailableDate: { type: Date, required: false },
    maxAttendees: { type: Number, required: true },
    registeredUsers: { type: Number, required: true },
    isFree: { type: Boolean, required: true },
    createdBy: {type: String, required: true},
    changedBy: { type: String},
    isDeleted: { type: Boolean, default: false },
    coursesDetails: [{ type: Schema.Types.ObjectId, ref: 'CourseDetail' }],
    trainingParts: [{ type: Schema.Types.ObjectId, ref: 'TrainingPart' }],
    shoppingCartItems: [{ type: Schema.Types.ObjectId, ref: 'ShoppingCartItem' }],
    orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }],
    feedbacks: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
    addOns: [{ type: Schema.Types.ObjectId, ref: 'AddOn' }],
    userNotes: [{ type: Schema.Types.ObjectId, ref: 'UserNote' }],
    learningOutcomes: [{ type: Schema.Types.ObjectId, ref: 'LearningOutcomes' }],
    courseDiscounts: [{ type: Schema.Types.ObjectId, ref: 'CourseDiscount' }],
    userFavorite: [{ type: Schema.Types.ObjectId, ref: 'UserFavorite' }],
    },
    {
        timestamps: true 
    }
);

export default mongoose.model<ICourse>('Course', courseSchema);
