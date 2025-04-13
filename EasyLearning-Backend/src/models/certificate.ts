import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICertificate extends Document {
    certificatePDFUrl: string;
    issuedDate: Date;
    certificateNumber: string;
    expirationDate?: Date;
    changedBy?: string;
    isDeleted: boolean;
    user: Types.ObjectId; 
    course: Types.ObjectId;
}

const certificateSchema: Schema<ICertificate> = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },  
        certificatePDFUrl: { type: String, required: true },
        issuedDate: { type: Date, required: true },
        certificateNumber: { type: String, required: true },
        expirationDate: { type: Date },
        changedBy: { type: String },
        isDeleted: { type: Boolean, default: false }
    },
    { 
    timestamps: true 
    }
);

export default mongoose.model<ICertificate>('Certificate', certificateSchema);
