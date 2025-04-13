import { Router, Request, Response } from 'express';
import  * as CourseController from '../controllers/courseController';
import * as CategoryController from '../controllers/categoryController';
import * as FeedbackController from '../controllers/feedbackController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';
import { CourseSearchQuery } from 'src/dtos/request/courseRequest';

const router = Router();

router.get('/top-four-most-registered-courses', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getTopFourMostRegisteredCourses();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});



router.get('/get-all-course', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getAllCourses();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/top-registered', async (req: Request, res: Response) => {
  try {
    const topCourses = await CourseController.getTopRegisteredCourses(4);
    responseSuccess(res, topCourses, 'Lấy 4 khoá học có số lượng đăng ký cao nhất thành công');
  } catch (err: any) {
    responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});



router.get('/get-course-with-discount', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getAllCourseWithDiscount();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/get-course-with-free', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getCourseWithFree();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/detail-course', async (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId as string;
    const result = await CourseController.getDetailCourse(courseId);
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/feedbacks-by-course-public', async (req: Request, res: Response) => {
    const { courseId } = req.query;
    if (!courseId || typeof courseId !== 'string') {
      return responseError(res, HttpCode.BAD_REQUEST, 'courseId is required');
    }
    try {
      const result = await FeedbackController.getFeedbacksForCoursePublic(courseId);
      return responseSuccess(res, result);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});

router.get('/feedbacks-with-five-rating', async (req: Request, res: Response) => {
  try {
    const result = await FeedbackController.getFeedbacksWithFiveRating();
    console.log("danh schs feeacbknef ", result);
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


router.get('/search', async (req: Request<{}, {}, {}, CourseSearchQuery>, res: Response) => {
  const { query = '', sortBy = '', courseType = '', rating } = req.query;

  try {
    const results = await CourseController.searchCourses(
      query,
      sortBy,
      courseType,
      rating,
    );
    responseSuccess(res, results, 'Lấy khóa học của bạn thành công');
  } catch (error: any) {
    responseError(res, HttpCode.INTERNAL_SERVER, error.message || 'Lỗi khi lấy khóa học');
  }
});


export default router;
