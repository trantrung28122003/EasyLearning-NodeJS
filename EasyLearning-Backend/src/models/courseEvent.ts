import { CourseEventType } from '../enums/courseEventType.enum';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICourseEvent extends Document {
    eventName: string;
    eventType: CourseEventType;
    location: string;
    dateStart: Date;
    dateEnd: Date;
    changedBy?: string;
    createdBy: string;
    isDeleted: boolean;
    trainingParts: Types.ObjectId[];
}

const courseEventSchema: Schema<ICourseEvent> = new Schema({
        eventName: { type: String, required: true },
        eventType: { type: String, enum: Object.values(CourseEventType), required: true },
        location: { type: String },
        dateStart: { type: Date, required: true },
        dateEnd: { type: Date, required: true },
        changedBy: { type: String},
        createdBy: {type: String, required: true},
        isDeleted: { type: Boolean, default: false },
        trainingParts: [{ type: Schema.Types.ObjectId, ref: 'TrainingPart' }],
    },
    { 
        timestamps: true 
    }
);

export default mongoose.model<ICourseEvent>('CourseEvent', courseEventSchema);
