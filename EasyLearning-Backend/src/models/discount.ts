import { DiscountType } from '../enums/discountType.enum';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDiscount extends Document {
    discountCode: string;
    discountName: string;
    discountType: DiscountType;
    startDate: Date;
    endDate: Date;
    active: boolean;
    value: number;  
    usageLimit: number;
    usageCount: number;
    description: string;
    changedBy?: string;
    isDeleted: boolean;
    courseDiscounts: Types.ObjectId[];  
    userDiscounts: Types.ObjectId[]; 
}

const discountSchema: Schema<IDiscount> = new Schema({
        discountCode: { type: String, required: true },
        discountName: { type: String, required: true },
        discountType: { type: String, enum: Object.values(DiscountType), required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        active: { type: Boolean, required: true },
        value: { type: Number, required: true },
        usageLimit: { type: Number, required: true },
        usageCount: { type: Number, required: true },
        description: { type: String },
        changedBy: { type: String},
        isDeleted: { type: Boolean, default: false },
        courseDiscounts: [{ type: Schema.Types.ObjectId, ref: 'CourseDiscount' }],
        userDiscounts: [{ type: Schema.Types.ObjectId, ref: 'UserDiscount' }]
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IDiscount>('Discount', discountSchema);
