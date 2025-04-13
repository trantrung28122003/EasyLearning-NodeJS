import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserNote extends Document {
    noteContent: string;
    timeStamp: number;
    trainingPart: string;
    course: Types.ObjectId;
    user: Types.ObjectId;
    changedBy?: string;
    isDeleted: boolean;
}

const userNoteSchema: Schema<IUserNote> = new Schema({
        noteContent: { type: String, required: true },
        timeStamp: { type: Number, required: true },
        trainingPart: { type: String , required: true},
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false },
    }, 
    { 
        timestamps: true 
    }
);

export default mongoose.model<IUserNote>('UserNote', userNoteSchema);
