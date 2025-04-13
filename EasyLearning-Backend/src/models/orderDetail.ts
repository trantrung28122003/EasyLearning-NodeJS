import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderDetail extends Document {
    orderDetailPrice?: number;
    orderDetailDiscount?: number;
    order: Types.ObjectId;
    course: Types.ObjectId;
    changedBy: string;
    isDeleted: boolean;
}

const orderDetailSchema: Schema<IOrderDetail> = new Schema({
        orderDetailPrice: { type: Number, required: false },
        orderDetailDiscount: { type: Number, required: false },
        order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        changedBy: { type: String, required: true },
        isDeleted: { type: Boolean, default: false }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IOrderDetail>('OrderDetail', orderDetailSchema);
