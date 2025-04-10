import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IShoppingCartItem extends Document {
    cartItemName: string;
    quantity: number;
    imageUrl: string;
    cartItemPrice: mongoose.Types.Decimal128;
    cartItemPriceDiscount: mongoose.Types.Decimal128;
    shoppingCart: Types.ObjectId;
    course: Types.ObjectId;
    changedBy: string;
    isDeleted: boolean;
    version: number; 
}

const shoppingCartItemSchema: Schema<IShoppingCartItem> = new Schema({
        cartItemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
        cartItemPrice: { type: Schema.Types.Decimal128, required: true },
        cartItemPriceDiscount: { type: Schema.Types.Decimal128, required: true },
        shoppingCart: { type: Schema.Types.ObjectId, ref: 'ShoppingCart', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        changedBy: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IShoppingCartItem>('ShoppingCartItem', shoppingCartItemSchema);
