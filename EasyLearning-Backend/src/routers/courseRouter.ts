import { Router, Request, Response } from 'express';
import * as CourseController from '../controllers/courseController';
import * as constants from '../utils/constants';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { handleImageUpload } from '../utils/uploadCloudinaryHandler';
import { check_authentication, check_authorization } from '../utils/authen';
import multer from 'multer';
import { CourseRequest , CourseSearchQuery} from '../dtos/request/courseRequest';
import { HttpCode } from "../enums/httpCode";
const router = Router();
const upload = multer();


router.get('/', async (req: Request, res: Response) => {
    try {
        const courses = await CourseController.getAllCourses();
        return responseSuccess(res, courses, 'Lấy danh sách course thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});




router.get('/my-courses', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const events = await CourseController.getCoursesByUser(user._id);
    responseSuccess(res, events, 'Lấy khóa học của bạn thành công');
  } catch (err) {
    responseError(res, HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy khóa học');
  }
});




router.post('/', check_authentication, check_authorization(constants.MOD_PERMISSION), upload.single('file'), async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      let imageUrl =  "https://res.cloudinary.com/dofr3xzmi/image/upload/v1744162084/elearning/vworklvnsvwrfdrtcnbs.jpg";
      if(req.file)
        imageUrl = await handleImageUpload(req.file);

      const courseData: CourseRequest = {
        ...req.body,
        imageUrl,
        categories: req.body.categories || [],
        createdBy : user._id,
        changedBy : user._id,
      };

      const createdCourse = await CourseController.createCourse(courseData);
      return responseSuccess(res, createdCourse, 'Tạo khoá học thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.put('/:courseId', check_authentication, check_authorization(constants.MOD_PERMISSION), upload.single('file'), async (req: Request, res: Response) => {
  try {
      const user = (req as any).user;
      const { courseId } = req.params;
      let imageUrl: string | undefined;
      if (req.file) {
        imageUrl = await handleImageUpload(req.file);
      }
      const courseData: CourseRequest = {
        ...req.body,
        imageUrl,
        categories: req.body.categories || [],
        changedBy: user._id
      };
        const updateCourse = await CourseController.updateCourse(courseId, courseData);
        return responseSuccess(res, updateCourse, 'Sửa khoá học thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);


router.delete('/:courseId', async (req: Request, res: Response) => {
    try {
      await CourseController.deleteCourse(req.params.categoryId);
      return responseSuccess(res, null, 'Xoá course thành công');
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  });
  
router.delete('/soft-delete/:courseId', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
    try {
        await CourseController.softDeleteCourse(req.params.courseId);
        return responseSuccess(res, null, 'Xoá mềm course thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
});




export default router;
