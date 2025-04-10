import { Router, Request, Response } from 'express';
import courseController, * as CourseController from '../controllers/courseController';
import * as CategoryController from '../controllers/categoryController';
import * as FeedbackController from '../controllers/feedbackController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';

const router = Router();

router.get('/topFourMostRegisteredCourses', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getTopFourMostRegisteredCourses();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/topFourMostCategory', async (req: Request, res: Response) => {
  try {
    const result = await CategoryController.findTop4BySortOrderNotNull();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/getAllCourse', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getAllCourses();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/getAllCategoryWithCourse', async (req: Request, res: Response) => {
  try {
    const result = await CategoryController.getAllCategoryWithCourse();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/getCategoryWithCourse/:categoryId', async (req: Request, res: Response) => {
  try {
    const {categoryId} = req.params;
    const result = await CategoryController.getCategoryWithCourse(categoryId);
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/getCourseWithDiscount', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getAllCourseWithDiscount();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/getCourseWithFree', async (req: Request, res: Response) => {
  try {
    const result = await CourseController.getCourseWithFree();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/detail-course/:courseId', async (req: Request, res: Response) => {
  try {
    const{courseId} = req.params;
    const result = await courseController.getDetailCourse(courseId);
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

// router.get('/getFeedbacksByCourseWithoutUser/:courseId', async (req: Request, res: Response) => {
//   try {
//     const result = await FeedbackController.getFeedbacksByCourseWithoutUser(req.params.courseId);
//     return responseSuccess(res, result);
//   } catch (err: any) {
//     return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
//   }
// });

router.get('/feedbacks-with-five-rating', async (req: Request, res: Response) => {
  try {
    const result = await FeedbackController.getFeedbacksWithFiveRating();
    return responseSuccess(res, result);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


export default router;
