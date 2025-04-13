import { Router, Request, Response } from 'express';
import * as CertificateController from '../controllers/certificateController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { check_authentication } from '../utils/authen';
import { HttpCode } from "../enums/httpCode";
const router = Router();


router.get('/by-user', check_authentication, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const certificates = await CertificateController.getAllCertificatesByUser(user._id);
        return responseSuccess(res, certificates, 'Lấy danh sách chứng chỉ thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});

router.get('/by-user-and-course', check_authentication, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const courseId = req.query.courseId as string;
        const certificates = await CertificateController.getCertificatesByCourseAndUser(courseId, user._id);
        return responseSuccess(res, certificates, 'Lấychứng chỉ thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});
router.post('/create', check_authentication , async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const courseId = req.query.courseId as string;
        const certificate = await CertificateController.createCertificate(courseId, user._id);
        return responseSuccess(res, certificate, 'Tạo chứng chỉ thành công');
        } catch (err: any) {
            return responseError(res, HttpCode.BAD_REQUEST, err.message);
        }
    }
);

export default router;
