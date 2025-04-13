import { NotificationType } from '../enums/notificationType.enum';
import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
    content: string;
    isRead: boolean;
    type: NotificationType;
    targetId?: string;
    user: Types.ObjectId;
    changedBy?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    targetId: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
}, 
{ 
    timestamps: true 
});

export default model<INotification>('Notification', notificationSchema);
