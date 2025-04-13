import { Router, Request, Response } from 'express';
import * as ExerciseQuestionController from '../controllers/exerciseController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';
import { check_authentication, check_authorization } from '../utils/authen';
import * as constants from '../utils/constants';

const router = Router();

router.get('/',check_authentication,check_authorization(constants.MOD_PERMISSION),
  async (req: Request, res: Response) => {
    try {
        const result = await ExerciseQuestionController.getAllExercise();
        return responseSuccess(res, result, 'Lấy tất cả câu hỏi thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.post('/:trainingPartId',check_authentication,check_authorization(constants.MOD_PERMISSION),
  async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const trainingPartId = req.params.trainingPartId; 
        const result = await ExerciseQuestionController.createExerciseQuestionWithAnswers(trainingPartId, req.body, user._id);
        return responseSuccess(res, result, 'Tạo câu hỏi và câu trả lời thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.get('/by-training-part', async (req: Request, res: Response) => {
  try {
    const trainingPartId = req.query.trainingPartId as string
      const questions = await ExerciseQuestionController.getExerciseByTrainingPart(trainingPartId);
      return responseSuccess(res, questions, 'Lấy danh sách câu hỏi theo phần học thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const question = await ExerciseQuestionController.getExerciseQuestionById(req.params.id);
    return responseSuccess(res, question, 'Lấy câu hỏi thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.NOT_FOUND, err.message);
  }
});

export default router;
