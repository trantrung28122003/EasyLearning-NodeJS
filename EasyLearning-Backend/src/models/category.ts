import { Schema, model, Document, Types } from 'mongoose';


export interface ICategory extends Document {
    categoryName: string;
    imageUrl?: string;
    sortOrder?: number;
    changedBy?: string;
    isDeleted: boolean;
    coursesDetails: Types.ObjectId[]; 
}

const categorySchema = new Schema<ICategory>({
    categoryName: { type: String, required: true, maxlength: 50 },
    imageUrl: { type: String },
    sortOrder: { type: Number },
    changedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
    coursesDetails: [{ type: Schema.Types.ObjectId, ref: 'CourseDetail' }]
    }, 
    { 
        timestamps: true 
    }
);

export default model<ICategory>('Category', categorySchema);


