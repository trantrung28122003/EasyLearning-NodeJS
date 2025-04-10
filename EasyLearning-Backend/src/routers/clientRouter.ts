import { Router, Request, Response } from 'express';
import * as FeedbackController from '../controllers/feedbackController';
import * as CourseController from '../controllers/courseController';
import * as constants from '../utils/constants';
import { responseSuccess, responseError } from '../utils/responseHandler';
import multer from 'multer';
import { handleImageUpload } from '../utils/uploadCloudinaryHandler';
import { check_authentication, check_authorization } from '../utils/authen';
import { HttpCode } from '../enums/httpCode';
import { FeedbackRequest } from 'src/dtos/request/feedbackRequest';

const router = Router();
const upload = multer();


router.post('/add-feedback/:courseId', check_authentication, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const {courseId} = req.params;
  
      console.log("tai khoan và khoa hoc"+ user._id +'khao hoc'+ courseId )
      const feedbackData: FeedbackRequest = {
          ...req.body,
          courseId : courseId,
          userId: user._id
          };
          console.log("feedback request", feedbackData);
      const feedback = await FeedbackController.createFeedback(feedbackData);
      return responseSuccess(res, feedback, 'Gửi feedback thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  });
  
  
  router.put('/update-feedback/:feedbackId', check_authentication, async (req: Request, res: Response) => {
    try {
      const updated = await FeedbackController.updateFeedback(req.params.feedbackId, req.body);
      return responseSuccess(res, updated, 'Cập nhật feedback thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  });


router.get('/purchasedCourses', check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const courses = await CourseController.getCoursePurchasedByUser(user._id);
    return responseSuccess(res, courses);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/searchCourseByName', async (req: Request, res: Response) => {
  try {
    const name = req.query.courseName as string;
    if (!name) {
      return responseError(res, HttpCode.BAD_REQUEST, 'Tên khóa học không được để trống');
    }

    const courses = await CourseController.findCoursesByName(name);
    return responseSuccess(res, courses);
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.get('/getCourseById/:courseId', async (req: Request, res: Response) => {
  try {
    const course = await CourseController.getCourseById(req.params.courseId);
    return responseSuccess(res, course);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/schedule/:courseId', check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).User;
    const schedule = await CourseController.getPurchasedCoursesSchedule(req.params.courseId, user._id);
    return responseSuccess(res, schedule);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/CourseStatus/:courseId', check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).User;
    const status = await CourseController.getCourseStatus(req.params.courseId, user._id);
    return responseSuccess(res, status);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.post('/toggleFavorite', check_authentication, async (req: Request, res: Response) => {
  try {
    const result = await CustomerController.toggleFavorite(req.query.courseId, req.user);
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.get('/favoritesCourseByUser', check_authentication, async (req: Request, res: Response) => {
  try {
    const favorites = await CustomerController.getFavoriteCourses(req.user);
    return responseSuccess(res, favorites);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/notificationByUser', check_authentication, async (req: Request, res: Response) => {
  try {
    const notifications = await CustomerController.getNotifications(req.user);
    return responseSuccess(res, notifications);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.post('/updateNotificationStatusIsRead', check_authentication, async (req: Request, res: Response) => {
  try {
    const notification = await CustomerController.markNotificationAsRead(req.body.notificationId);
    return responseSuccess(res, notification);
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.post('/updateProfile', check_authentication, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const imageUrl = req.file ? await handleImageUpload(req.file) : undefined;
    const user = await CustomerController.updateProfile(req.user, req.body.fullName, imageUrl);
    return responseSuccess(res, user);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

export default router;
