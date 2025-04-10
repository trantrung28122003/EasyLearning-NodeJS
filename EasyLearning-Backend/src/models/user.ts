import mongoose, { Schema, Document, Types } from 'mongoose';
import { hashPassword } from '../utils/hashing';

export interface IUser extends Document {
  userName: string;
  email: string;
  fullName: string;
  dayOfBirth?: Date;
  imageUrl?: string;
  password: string;
  changedBy?: string;
  isDeleted: boolean;
  roles: Types.ObjectId;
  shoppingCart: Types.ObjectId;
  userTrainingProgress: Types.ObjectId[];
  orders: Types.ObjectId[];
  userNotes: Types.ObjectId[];
  notifications: Types.ObjectId[];
  userDiscounts: Types.ObjectId[];
  userFavorite: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordTokenExp?: Date;
}

const userSchema: Schema<IUser> = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dayOfBirth: { type: Date },
  imageUrl: { type: String },
  password: { type: String, required: true },
  changedBy: { type: String },
  isDeleted: { type: Boolean, default: false },
  roles: { type: Schema.Types.ObjectId, ref: 'Role' },
  shoppingCart: { type: Schema.Types.ObjectId, ref: 'ShoppingCart' },
  userTrainingProgress: [{ type: Schema.Types.ObjectId, ref: 'UserTrainingProgress' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  userNotes: [{ type: Schema.Types.ObjectId, ref: 'UserNote' }],
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  userDiscounts: [{ type: Schema.Types.ObjectId, ref: 'UserDiscount' }],
  userFavorite: [{ type: Schema.Types.ObjectId, ref: 'UserFavorite' }],
  resetPasswordToken: { type: String },
  resetPasswordTokenExp: { type: Date },
},{timestamps: true});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err as any);
  }
});

export default mongoose.model<IUser>('User', userSchema);
