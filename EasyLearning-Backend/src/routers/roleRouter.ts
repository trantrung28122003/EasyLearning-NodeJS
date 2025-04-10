import { Router, Request, Response } from "express";
import { getAllRolesService, createRoleService } from "../controllers/roleController";
import { responseSuccess, responseError } from "../utils/responseHandler";
import { HttpCode } from "../enums/httpCode";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const roles = await getAllRolesService();
    return responseSuccess(res, roles, "Lấy danh sách role thành công");
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message || "Lỗi server khi lấy roles");
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const role = await createRoleService({ name, description });
    return responseSuccess(res, role, "Tạo role thành công");
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message || "Lỗi khi tạo role");
  }
});

export default router;
