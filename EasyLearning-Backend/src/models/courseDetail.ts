import { Schema, model, Types, Document } from 'mongoose';

export interface ICourseDetail extends Document {
    course: Types.ObjectId;  
    category: Types.ObjectId;
    changedBy?: string;
    isDeleted: boolean;
}

const courseDetailSchema: Schema<ICourseDetail> = new Schema({
    course: { type: Schema.Types.ObjectId,ref: 'Course', required: true,},
    category: { type: Schema.Types.ObjectId, ref: 'Category',  required: true,},
    changedBy: { type: String},
    isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true
    });

export default model<ICourseDetail>('CourseDetail', courseDetailSchema);
