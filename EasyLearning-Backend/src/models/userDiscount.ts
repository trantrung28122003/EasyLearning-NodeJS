import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserDiscount extends Document {
    user: Types.ObjectId;
    discount: Types.ObjectId;
    active: boolean;
    isUsed: boolean;
    changedBy?: string;
    isDeleted: boolean;

}

const userDiscountSchema: Schema<IUserDiscount> = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        discount: { type: Schema.Types.ObjectId, ref: 'Discount', required: true },
        active: { type: Boolean, required: true },
        isUsed: { type: Boolean, required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false },
    }, 
    { 
        timestamps: true 
    }
);

export default mongoose.model<IUserDiscount>('UserDiscount', userDiscountSchema);
