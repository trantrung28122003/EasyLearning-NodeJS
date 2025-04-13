import mongoose, { Schema, Document, Types } from 'mongoose';
 

export interface IShoppingCart extends Document {
    totalPrice: number;
    totalPriceDiscount: number;
    user: Types.ObjectId;
    shoppingCartItems: Types.ObjectId[];
    changedBy: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


const shoppingCartSchema: Schema<IShoppingCart> = new Schema({
        totalPrice: { type: Number, required: true },
        totalPriceDiscount: { type: Number, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        shoppingCartItems: [{ type: Schema.Types.ObjectId, ref: 'ShoppingCartItem' }],
        changedBy: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    { 
    timestamps: true 
    }
);

export default mongoose.model<IShoppingCart>('ShoppingCart', shoppingCartSchema);
