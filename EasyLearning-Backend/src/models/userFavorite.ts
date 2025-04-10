import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserFavorite extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    changedBy?: string;
    isDeleted: boolean;
}

const userFavoriteSchema: Schema<IUserFavorite> = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false, required: true },
    }, 
    { 
        timestamps: true 
    }
);

export default mongoose.model<IUserFavorite>('UserFavorite', userFavoriteSchema);
