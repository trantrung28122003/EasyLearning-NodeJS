import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICourseDiscount extends Document {
    course: Types.ObjectId; 
    discount: Types.ObjectId;  
    active: boolean;
    isCodeRequired: boolean;
    changedBy?: string;
    isDeleted: boolean;
}

const courseDiscountSchema: Schema<ICourseDiscount> = new Schema({
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },  
        discount: { type: Schema.Types.ObjectId, ref: 'Discount', required: true },
        active: { type: Boolean, required: true },
        isCodeRequired: { type: Boolean, required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false }
    },
    { 
        timestamps: true 
    }   
);

export default mongoose.model<ICourseDiscount>('CourseDiscount', courseDiscountSchema);
