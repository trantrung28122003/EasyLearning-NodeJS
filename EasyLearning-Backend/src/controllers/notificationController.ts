import Comment from '../models/comment';
import Notification from '../models/notification';
import Course from '../models/course';
import User from '../models/user';
import TrainingPart from '../models/trainingPart';
import { NotificationType } from '../enums/notificationType.enum';
import { CourseType } from '../enums/courseType.enum';

export const getAllNotificationByUser = async (userId: string) => {
    try {
        const notifications = await Notification.find({ user: userId }).sort({ dateCreate: -1 });
        return notifications.map(notification=> ({
            id: notification._id,
            contentNotification: notification.content,
            isRead: notification.isRead,
            targetId: notification.targetId,
            type: notification.type
        }));
    } catch (error) {
        throw new Error('Không thể lấy thông báo.');
    }
};

export const addNotificationForAllUsers = async (content: string) => {
    try {
        const users = await User.find({ isDeleted: false });
        if (!users.length) {
            throw new Error('Không tìm thấy người dùng nào.');
        }

        const notifications = users.map(user => {
            return new Notification({
                content,
                type: NotificationType.SYSTEM_ALERT,
                isRead: false,
                user: user._id,
                isDeleted: false,
                changedBy: 'Hệ thống'
            });
        });
        const savedNotifications = await Notification.insertMany(notifications);

        return savedNotifications.map(notification => ({
            id: notification._id,
            contentNotification: notification.content,
            dateCreate: notification.createdAt,
            isRead: notification.isRead,
            type: notification.type,
            targetId: notification.targetId
        }));

    } catch (error: any) {
        throw new Error('Lỗi khi tạo thông báo cho tất cả người dùng: ' + error.message);
    }
};


export const addNotificationByComment = async (data: any) => {
    try {
        const comment = await Comment.findById(data.commentId);
        if (!comment) throw new Error('Không tìm thấy bình luận.');

        const trainingPart = await TrainingPart.findById(comment.trainingPart._id);
        if (!trainingPart) throw new Error('Không tìm thấy phần học.');

        const course = await Course.findById(trainingPart.course._id);
        if (!course) throw new Error('Không tìm thấy khóa học.');

        const userOfComment = await User.findById(comment.user._id);
        if (!userOfComment) throw new Error('Không tìm thấy người dùng bình luận.');

        const contentNotification = `Có người đã trả lời bình luận của bạn tại phần học ${trainingPart.trainingPartName} của khóa học ${course.courseName}`;
        const targetId = `/learning/${course._id}?trainingPartId=${trainingPart._id}`;

        const notificationOfUserId = data.parentReplyUserId || userOfComment._id;

        const notification = new Notification({
            content: contentNotification,
            type: NotificationType.COMMENT,
            isRead: false,
            userId: notificationOfUserId,
            isDeleted: false,
            targetId: targetId,
            changedBy: 'Hệ thống'
        });

        await notification.save();

    
        const notificationResponse = {
            id: notification._id,
            contentNotification: notification.content,
            dateCreate: notification.createdAt,
            isRead: notification.isRead,
            type: notification.type,
            targetId: notification.targetId
        };

       
        return notificationResponse;
    } catch (error: any) {
        throw new Error('Lỗi khi thêm thông báo cho bình luận: ' + error.message);
    }
};


export const addNotificationByPurchaseCourse = async (courseId: string, currentUserId: string) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) throw new Error('Không tìm thấy khóa học.');


        const contentNotification = course.isFree ? `Bạn tham gia thành công khóa học ${course.courseName} miễn phí. Chúc bạn học tập hiệu quả!`
            : `Bạn đã mua thành công khóa học ${course.courseName}. Chúc bạn học tập hiệu quả!`;

        const targetId = course.courseType === CourseType.ONLINE ? `/learning/${course._id}` : `/schedule`;

        const notification = new Notification({
            content: contentNotification,
            type: NotificationType.PAYMENT,
            isRead: false,
            userId: currentUserId,
            isDeleted: false,
            targetId: targetId,
            changedBy: 'Hệ thống'
        });

        await notification.save();

        const notificationResponse = {
            id: notification._id,
            contentNotification: notification.content,
            dateCreate: notification.createdAt,
            isRead: notification.isRead,
            type: notification.type,
            targetId: notification.targetId
        };

        return notificationResponse;
    } catch (error: any) {
        throw new Error('Lỗi khi thêm thông báo cho việc mua khóa học: ' + error.message);
    }
};


export const addNotificationByCertification = async (courseId: string, currentUserId: string) => {
    try {
        const course = await Course.findById(courseId);
        if (!course) throw new Error('Không tìm thấy khóa học.');

        const contentNotification = `Chúc mừng bạn đã hoàn thành chứng chỉ của khóa học ${course.courseName}! Hãy tiếp tục hành trình học tập của mình nhé.`;

        const targetId = "/certificate";

        const notification = new Notification({
            content: contentNotification,
            type: NotificationType.CERTIFICATION,
            isRead: false,
            userId: currentUserId,
            isDeleted: false,
            targetId: targetId,
            changedBy: 'Hệ thống'
        });

        await notification.save();

        const notificationResponse = {
            id: notification._id,
            contentNotification: notification.content,
            dateCreate: notification.createdAt,
            isRead: notification.isRead,
            type: notification.type,
            targetId: notification.targetId
        };

        return notificationResponse;
    } catch (error: any) {
        throw new Error('Lỗi khi thêm thông báo về chứng chỉ: ' + error.message);
    }
};


export const updateStatusIsRead = async (notificationId: string, currentUserId : string) => {
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) throw new Error('Không tìm thấy thông báo.');
        if(notification.user._id.toString() === currentUserId)
            throw new Error('Bạn không phải là người nhận thông báo này');
        notification.isRead = true;
        await notification.save();

        const notificationResponse = {
            id: notification._id,
            contentNotification: notification.content,
            isRead: notification.isRead,
            type: notification.type,
            targetId: notification.targetId,
            
        };

        return notificationResponse;
    } catch (error : any) {
        throw new Error('Lỗi khi cập nhật trạng thái đọc của thông báo: ' + error.message);
    }
};
