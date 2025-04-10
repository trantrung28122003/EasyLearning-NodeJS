import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
    content: string;
    user: Types.ObjectId;
    trainingPart: Types.ObjectId; 
    replies: Types.ObjectId[];  
    changedBy?: string;
    isDeleted: boolean;
}

const commentSchema: Schema<IComment> = new Schema({
        content: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
        trainingPart: { type: Schema.Types.ObjectId, ref: 'TrainingPart', required: true },  
        replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }], 
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false }
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<IComment>('Comment', commentSchema);
