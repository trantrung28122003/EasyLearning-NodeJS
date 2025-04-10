import mongoose, { Schema, Document, Types } from 'mongoose';
 

export interface IShoppingCart extends Document {
    totalPrice: mongoose.Types.Decimal128;
    totalPriceDiscount: mongoose.Types.Decimal128;
    user: Types.ObjectId;
    shoppingCartItems: Types.ObjectId[];
    changedBy: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}


const shoppingCartSchema: Schema<IShoppingCart> = new Schema({
        totalPrice: { type: Schema.Types.Decimal128, required: true },
        totalPriceDiscount: { type: Schema.Types.Decimal128, required: true },
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
