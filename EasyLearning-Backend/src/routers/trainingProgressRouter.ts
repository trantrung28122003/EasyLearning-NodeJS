import { Router, Request, Response } from 'express';
import * as UserTrainingProgressController from '../controllers/userTrainingProgressController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';
import { check_authentication } from '../utils/authen';

const router = Router();

router.get('/course-and-user', check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const courseId = req.query.courseId as string;
    const result = await UserTrainingProgressController.getUserTrainingProgressByCourse(courseId, user._id);
    return responseSuccess(res, result, 'Lấy tiến trình học theo khoá học thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/by-part',check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const trainingPartId = req.query.trainingPartId as string;
    const result = await UserTrainingProgressController.getUserTrainingProgressByTrainingPart(trainingPartId, user._id);
    return responseSuccess(res, result, 'Lấy tiến trình theo phần học thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


router.put('/status-part-process', check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const trainingPartId = req.query.trainingPartId as string;
    const scoreRequest = req.body;
    const result = await UserTrainingProgressController.updatePartProgress(trainingPartId, scoreRequest, user._id);
    return responseSuccess(res, result, 'Cập nhật tiến độ học thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

export default router;
