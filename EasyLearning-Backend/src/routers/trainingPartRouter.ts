import { Router, Request, Response } from "express";
import * as TrainingPartController from "../controllers/trainingPartController";
import { responseSuccess, responseError } from "../utils/responseHandler";
import { HttpCode } from "../enums/httpCode";
import { check_authentication, check_authorization } from "../utils/authen";
import * as constants from "../utils/constants";
import { TrainingPartRequest } from "../dtos/request/trainingPartRequest";
import upload from "../middlewares/upload";
import { handleImageUpload, handleVideoUpload } from "../utils/uploadCloudinaryHandler";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const trainingParts = await TrainingPartController.getAllTrainingParts();
    return responseSuccess(
      res,
      trainingParts,
      "Lấy danh sách training part thành công"
    );
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/my-training-part', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const events = await TrainingPartController.getTrainingPartsByUser(user._id);
    responseSuccess(res, events, 'Lấy phần học của bạn thành công');
  } catch (err) {
    responseError(res, HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy phần học');
  }
});

router.get("/:courseId", async (req: Request, res: Response) => {
  try {
    const result = await TrainingPartController.getTrainingPartsByCourseId(
      req.params.courseId
    );
    const filtered = result.filter((tp: any) => !tp.isDeleted);
    return responseSuccess(
      res,
      filtered,
      "Lấy training part theo courseId thành công"
    );
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.post("/:courseId",check_authentication,check_authorization(constants.MOD_PERMISSION),upload.fields([{ name: "imageFile" }, { name: "videoFile" }]),
  async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const user = (req as any).user;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const imageFile = files?.["imageFile"]?.[0];
        const videoFile = files?.["videoFile"]?.[0];
        const imageUrl = imageFile ? await handleImageUpload(imageFile) : "";
        const videoUrl = videoFile ? await handleVideoUpload(videoFile) : "";

        const trainingPartData: TrainingPartRequest = {
            ...req.body,
            imageUrl,
            videoUrl,
            createdBy: user._id,
            changedBy: user._id,
        };
        const created = await TrainingPartController.createTrainingPart(
            courseId,
            trainingPartData
        );
        return responseSuccess(res, created, "Tạo training part thành công");
    } catch (err: any) {
         return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.put("/:trainingPartId", check_authentication, check_authorization(constants.MOD_PERMISSION),upload.fields([{ name: "imageFile" }, { name: "videoFile" }]) ,async (req: Request, res: Response) => {
    try {
        const { trainingPartId } = req.params;
        const user = (req as any).user;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        let imageUrl: string | undefined;
        let videoUrl: string | undefined;

        const imageFile = files?.["imageFile"]?.[0];
        const videoFile = files?.["videoFile"]?.[0];

        if (imageFile) {
            imageUrl = await handleImageUpload(imageFile);
        }
    
        if (videoFile) {
            videoUrl = await handleVideoUpload(videoFile);
        }
        const updateData: any = {
            ...req.body,
            imageUrl,
            videoUrl,
            changedBy: user._id,
        };

        const updated = await TrainingPartController.updateTrainingPart(
            trainingPartId,
            updateData
        );
        return responseSuccess(res, updated, "Cập nhật training part thành công");
    } catch (err: any) {
        return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.delete("/:trainingPartId", check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
    try {
      await TrainingPartController.deleteTrainingPart(req.params.trainingPartId);
      return responseSuccess(res, null, "Xoá training part thành công");
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

router.post("/softDelete/:trainingPartId", check_authentication, check_authorization(constants.MOD_PERMISSION),async (req: Request, res: Response) => {
    try {
      await TrainingPartController.softDeleteTrainingPart(req.params.trainingPartId);
      return responseSuccess(res, null, "Xoá mềm training part thành công");
    } catch (err: any) {
      return responseError(res, HttpCode.BAD_REQUEST, err.message);
    }
  }
);

export default router;
