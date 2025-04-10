import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserNote extends Document {
    noteContent: string;
    timeStamp: mongoose.Types.Decimal128;
    trainingPart: Types.ObjectId;
    course: Types.ObjectId;
    user: Types.ObjectId;
    changedBy?: string;
    isDeleted: boolean;
}

const userNoteSchema: Schema<IUserNote> = new Schema({
        noteContent: { type: String, required: true },
        timeStamp: { type: Schema.Types.Decimal128, required: true },
        trainingPart: { type: Schema.Types.ObjectId, ref: 'TrainingPart', required: true },
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
