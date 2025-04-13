import { Router, Request, Response } from 'express';
import * as NotificationController from '../controllers/notificationController';
import { check_authentication } from '../utils/authen';
import { HttpCode } from "../enums/httpCode";
import { responseSuccess, responseError } from '../utils/responseHandler';

const router = Router();

router.get("/my-notification",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const notifications =
        await NotificationController.getAllNotificationByUser(user._id);
      return responseSuccess(res, notifications);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

router.put("/mark-notification-read",check_authentication,async (req: Request, res: Response) => {
    try {
        const notificationId = req.query.notificationId as string;
        const user = (req as any).user;
        const notification = await NotificationController.updateStatusIsRead(notificationId ,user._id 
      );
      return responseSuccess(res, notification);
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);


router.post('/send-to-all', check_authentication,  async (req: Request, res: Response) => {
    try {
        const { content} = req.body;
        const result = await NotificationController.addNotificationForAllUsers(content);
        return responseSuccess(res, result, 'Tạo thông báo cho tất cả người dùng thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});


router.post('/comment', check_authentication, async (req: Request, res: Response) => {
    try {
        const result = await NotificationController.addNotificationByComment(req.body);
        return responseSuccess(res, result, 'Tạo thông báo bình luận thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});


router.post('/purchase', check_authentication, async (req: Request, res: Response) => {
    try {
        const { courseId, currentUserId } = req.body;
        const result = await NotificationController.addNotificationByPurchaseCourse(courseId, currentUserId);
        return responseSuccess(res, result, 'Tạo thông báo mua khóa học thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});


router.post('/certification', check_authentication, async (req: Request, res: Response) => {
    try {
        const { courseId, currentUserId } = req.body;
        const result = await NotificationController.addNotificationByCertification(courseId, currentUserId);
        return responseSuccess(res, result, 'Tạo thông báo hoàn thành chứng chỉ thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});


export default router;
