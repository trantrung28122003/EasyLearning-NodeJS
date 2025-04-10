import { Router, Request, Response } from 'express';
import { responseError, responseSuccess } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';
import * as CourseEventController from '../controllers/courseEventController'
import * as constants from '../utils/constants'
import { check_authentication, check_authorization } from '../utils/authen';
import { CourseEventRequest } from '../dtos/request/courseEventRequest';
const router = Router();


router.get('/', async (_req: Request, res: Response) => {
  try {
   const courseEvents = await CourseEventController.getAllCourseEvents();
    responseSuccess(res, courseEvents, 'Lấy danh sách CourseEvent thành công');
  } catch (err) {
    responseError(res, HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy danh sách CourseEvent');
  }
});

router.get('/my-events', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const events = await CourseEventController.getCourseEventsByUser(user._id);
    responseSuccess(res, events, 'Lấy buổi học của bạn thành công');
  } catch (err) {
    responseError(res, HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy buổi học');
  }
});


router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const courseEvent: CourseEventRequest = {
        ...req.body,
        createdBy : user._id,
        changedBy : user._id,
    };

    const createCourseEvent = await CourseEventController.createCourseEvent(courseEvent);
    responseSuccess(res, createCourseEvent, 'Tạo buổi học thành công');
  } catch (err) {
    responseError(res, HttpCode.BAD_REQUEST, 'Không thể tạo buổi học');
  }
});

router.put('/:id', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const updateData: CourseEventRequest = {
        ...req.body,
        changeBy: user._id
      };
  
      const updated = await CourseEventController.updateCourseEvent(req.params.id, updateData);
      if (!updated) {
        return responseError(res, HttpCode.NOT_FOUND, 'Buổi học không tồn tại hoặc đã bị xoá');
      }
  
      responseSuccess(res, updated, 'Cập nhật buổi học thành công');
    } catch (err) {
      responseError(res, HttpCode.BAD_REQUEST, 'Không thể cập nhật buổi học');
    }
});

router.delete('/:courseEventId',check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
    try {
      await CourseEventController.deleteCourseEvent(req.params.courseEventId);
      return responseSuccess(res, null, 'Xoá coursEvent thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  });
  
router.delete('/soft-delete/:courseEventId', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
    try {
        await CourseEventController.softDeleteCourseEvent(req.params.courseEventId);
        return responseSuccess(res, null, 'Xoá mềm coursEvent thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});



export default router;
