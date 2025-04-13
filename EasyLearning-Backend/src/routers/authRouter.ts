import { Router, Request, Response, NextFunction } from 'express';
import { responseCookie, responseSuccess, responseError } from '../utils/responseHandler';
import * as authenController from '../controllers/authController';
import * as userController from '../controllers/userController';
import { LoginValidator, SignUpValidator, validate } from '../middlewares/validator';
import upload from '../middlewares/upload';
import { handleAvatarUpload } from '../utils/uploadCloudinaryHandler';

import { HttpCode } from "../enums/httpCode";
import { check_authentication } from '../utils/authen';
const router = Router();


router.get('/me', check_authentication, async (req: Request, res: Response) => {
  try {
      const user = (req as any).user;
      const userInfo = await authenController.getMyInfo(user._id);
      responseSuccess(res, userInfo, 'Lấy thông tin người dùng thành công');
  } catch (error) {
      responseError(res, HttpCode.UNAUTHORIZED, (error as Error).message || 'Không xác thực được người dùng');
  }
});

router.post('/login', LoginValidator, validate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, password } = req.body;
        const token: string = await authenController.login(userName, password);
        const exp = Date.now() + 60 * 60 * 1000; 
        responseCookie(res, 'token', token, exp);
        
        responseSuccess(res, token, 'Đăng nhập thành công nèee');
    } catch (error) {
        responseError(res, HttpCode.BAD_REQUEST, (error as Error).message || 'Đăng nhập thất bại');
    }
});

router.post('/signup', upload.single('avatar'), SignUpValidator, validate ,async (req: Request, res: Response) => {
      try {
        
        let avatarUrl = 'https://res.cloudinary.com/demo/image/upload/v123456789/default_avatar.png';
        if (req.file) {
          avatarUrl = await handleAvatarUpload(req.file);
        }
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
