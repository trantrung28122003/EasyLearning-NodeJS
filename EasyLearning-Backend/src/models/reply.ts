import mongoose, { Schema, Document , Types} from 'mongoose';

export interface IReply extends Document {
    content: string;
    user: Types.ObjectId;
    comment: Types.ObjectId; 
    changedBy?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const replySchema: Schema<IReply> = new Schema({
        content: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false, required: true }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IReply>('Reply', replySchema);
