import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    orderTotalPrice: number;
    orderPaymentMethod: string;
    orderNotes?: string;
    orderQuantity: number;
    isFree: boolean;
    changedBy?: string;
    isDeleted: boolean;
    user: Types.ObjectId;
    orderDetails: Types.ObjectId[]; 
}

const orderSchema: Schema<IOrder> = new Schema({
        orderTotalPrice: { type: Number, required: true },
        orderPaymentMethod: { type: String, required: true },
        orderNotes: { type: String },
        orderQuantity: { type: Number, required: true },
        isFree: { type: Boolean, required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
        orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }], 
    }, 
    { 
        timestamps: true 
    });

export default mongoose.model<IOrder>('Order', orderSchema);
