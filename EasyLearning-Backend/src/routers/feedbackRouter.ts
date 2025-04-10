import { Router, Request, Response } from 'express';
import * as FeedbackController from '../controllers/feedbackController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';
import { check_authentication } from '../utils/authen';
import { FeedbackRequest } from '../dtos/request/feedbackRequest';

const router = Router();



router.get('/:courseId', check_authentication, async (req: Request, res: Response) => {
  try {
    const {courseId} = req.params;
    const user = (req as any).user;
    const response = await FeedbackController.getFeedbackForCourse(courseId, user._id);
    return responseSuccess(res, response, 'Lấy feedback theo khóa học thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

export default router;
