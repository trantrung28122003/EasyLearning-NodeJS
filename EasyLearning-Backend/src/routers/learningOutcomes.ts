import { Router, Request, Response } from 'express';
import * as LearningOutcomesController from '../controllers/learningOutcomesController';
import * as constants from '../utils/constants';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { check_authentication, check_authorization } from '../utils/authen';
import { HttpCode } from '../enums/httpCode';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const learningOutcomes = await LearningOutcomesController.getAllLearningOutcomes();
    return responseSuccess(res, learningOutcomes, 'Lấy danh sách LearningOutcomes thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const learningOutcome = await LearningOutcomesController.createLearningOutcome(req.body);
    return responseSuccess(res, learningOutcome, 'Tạo LearningOutcome thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});


router.put('/:learningOutcomeId', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const { learningOutcomeId } = req.params;
    const updatedLearningOutcome = await LearningOutcomesController.updateLearningOutcome(learningOutcomeId, req.body);
    return responseSuccess(res, updatedLearningOutcome, 'Cập nhật LearningOutcome thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});


router.delete('/:learningOutcomeId', async (req: Request, res: Response) => {
  try {
    await LearningOutcomesController.deleteLearningOutcome(req.params.learningOutcomeId);
    return responseSuccess(res, null, 'Xoá LearningOutcome thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});


router.delete('/soft-delete/:learningOutcomeId', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    await LearningOutcomesController.softDeleteLearningOutcome(req.params.learningOutcomeId);
    return responseSuccess(res, null, 'Xoá mềm LearningOutcome thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

export default router;
