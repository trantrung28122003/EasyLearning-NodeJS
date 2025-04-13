import { Router, Request, Response } from "express";
import * as UserController from "../controllers/userController";
import * as FeedbackController from "../controllers/feedbackController";
import * as CourseController from "../controllers/courseController";
import * as UserFavoriteController from "../controllers/userFavoriteController";
import * as NotificationController from "../controllers/notificationController";
import * as OrderController from "../controllers/orderController";
import * as NoteController from "../controllers/noteController";
import { responseSuccess, responseError } from "../utils/responseHandler";
import multer from "multer";
import { handleAvatarUpload } from "../utils/uploadCloudinaryHandler";
import { check_authentication } from "../utils/authen";
import { HttpCode } from "../enums/httpCode";
import { FeedbackRequest } from "../dtos/request/feedbackRequest";

const router = Router();
const upload = multer();

router.post("/add-feedback",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = req.query.courseId as string;
      const feedbackData: FeedbackRequest = {
        ...req.body,
        courseId: courseId,
        userId: user._id,
      };
      const feedback = await FeedbackController.createFeedback(feedbackData);
      return responseSuccess(res, feedback, "Gửi feedback thành công");
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.put( "/update-feedback/:feedbackId",check_authentication,async (req: Request, res: Response) => {
    try {
      const updated = await FeedbackController.updateFeedback(
        req.params.feedbackId,
        req.body
      );
      return responseSuccess(res, updated, "Cập nhật feedback thành công");
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);
router.post("/add-course-free",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = req.query.courseId as string;
      const addFreeCourseSuccess = await OrderController.addFreeCourseOrder(
        courseId,
        user._id
      );
      if (addFreeCourseSuccess) {
        return responseSuccess(res, "Đăng kí khóa học miễn phí thành công");
      } else {
        return responseError(
          res,
          HttpCode.INTERNAL_SERVER,
          "Không thể tạo hóa đơn"
        );
      }
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.get("/purchased-courses",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courses = await CourseController.getCoursePurchasedByUser(user._id);
      return responseSuccess(res, courses);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

router.get("/purchased-history",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courses = await OrderController.getPurchaseHistory(user._id);
      return responseSuccess(res, courses);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

router.get("/search-course-by-name", async (req: Request, res: Response) => {
  try {
    const name = req.query.courseName as string;
    if (!name) {
      return responseError(
        res,
        HttpCode.BAD_REQUEST,
        "Tên khóa học không được để trống"
      );
    }

    const courses = await CourseController.findCoursesByName(name);
    return responseSuccess(res, courses);
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.get("/get-course/:courseId", async (req: Request, res: Response) => {
  try {
    const course = await CourseController.getCourseById(req.params.courseId);
    return responseSuccess(res, course);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get("/schedule/:courseId",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const schedule = await CourseController.getPurchasedCoursesSchedule(
        req.params.courseId,
        user._id
      );
      return responseSuccess(res, schedule);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

router.get("/course-status",check_authentication,async (req: Request, res: Response) => {
    try {
      const courseId = req.query.courseId as string;
      const user = (req as any).user;
      const status = await CourseController.getCourseStatus(courseId, user._id);
      return responseSuccess(res, status);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

router.post( "/toggle-favorite",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = req.query.courseId as string;
      const result = await UserFavoriteController.toggleFavorite(
        courseId,
        user._id
      );
      return responseSuccess(res, result);
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.get("/my-favorites-course",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const favorites = await UserFavoriteController.getFavoriteCoursesByUserId(
        user._id
      );
      return responseSuccess(res, favorites);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);



router.get("/my-note-by-course",check_authentication,async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const courseId = req.query.courseId as string;
      const notes = await NoteController.getNotesByCourseIdAndUserId(
        courseId,
        user._id
      );
      return responseSuccess(res, notes);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

router.post("/add-note-by-course",check_authentication,async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const user = (req as any).user;

      const note = await NoteController.createUserNote(data, user._id);
      return responseSuccess(res, note);
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.post("/update-note-by-course",check_authentication,async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const user = (req as any).user;
      const noteId = req.query.noteId as string;
      const note = await NoteController.updateUserNote(noteId, data, user._id);
      return responseSuccess(res, note);
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.delete("/delete-note-by-course", async (req: Request, res: Response) => {
  try {
    const noteId = req.query.noteId as string;
    await NoteController.deleteUserNote(noteId);
    return responseSuccess(res, null, "Xoá ghi chú trong khóa học thành công");
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.post("/update-profile",check_authentication,upload.single("file"),async (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user;
      const imageUrl = req.file
        ? await handleAvatarUpload(req.file)
        : undefined;

      const user = await UserController.updateProfile(
        currentUser._id,
        req.body.fullName,
        imageUrl
      );
      return responseSuccess(res, user);
    } catch (err: any) {
      return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
  }
);

export default router;
