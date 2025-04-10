import { Router, Request, Response, NextFunction } from 'express';
import { responseCookie, responseSuccess, responseError } from '../utils/responseHandler';
import * as authenController from '../controllers/authController';
import * as userController from '../controllers/userController';
import { LoginValidator, SignUpValidator, validate } from '../middlewares/validator';
import { uploadToCloudinary } from '../utils/cloudinary';
import upload from '../middlewares/upload';
import { handleAvatarUpload } from '../utils/uploadCloudinaryHandler';
const router = Router();
import { HttpCode } from "../enums/httpCode";
router.post('/login', LoginValidator, validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, password } = req.body;
        const token: string = await authenController.login(userName, password);
        const exp = Date.now() + 60 * 60 * 1000; 
        responseCookie(res, 'token', token, exp);
        responseSuccess(res, token, 'Đăng nhập thành công');
    } catch (error) {
        responseError(res, HttpCode.BAD_REQUEST, (error as Error).message || 'Đăng nhập thất bại');
    }
});

router.post('/signup', upload.single('avatar'), SignUpValidator, validate ,async (req: Request, res: Response) => {
      try {
        let avatarUrl = 'https://res.cloudinary.com/demo/image/upload/v123456789/default_avatar.png';
        avatarUrl = await handleAvatarUpload(req.file);
        const newUser = await userController.createUser({
        ...req.body,
        avatarUrl,
        });
  
        responseSuccess(res, newUser, 'Tạo tài khoản thành công');
      } catch (error) {
        responseError(res, HttpCode.BAD_REQUEST, (error as Error).message || 'Tạo tài khoản thất bại');
      }
    }
);

router.get('/logout', function (req: Request, res: Response, next : NextFunction) {
    responseCookie(res, 'token', '', Date.now());
    return responseSuccess(res, null, 'Đăng xuất thành công');
});

export default router;
