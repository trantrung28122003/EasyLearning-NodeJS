// routes/user.routes.ts
import { Router, Request, Response } from 'express';
import * as UserController from '../controllers/userController';
import * as constants from '../utils/constants';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { check_authentication, check_authorization } from '../utils/authen';
import { HttpCode } from '../enums/httpCode';

const router = Router();

router.get('/', check_authentication, check_authorization(constants.MOD_PERMISSION), async (req: Request, res: Response) => {
  try {
    const users = await UserController.getAllUsers();
    return responseSuccess(res, users, 'Lấy danh sách người dùng thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await UserController.getUserById(req.params.id);
    return responseSuccess(res, user, 'Lấy thông tin người dùng thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.NOT_FOUND, err.message);
  }
});

router.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const user = await UserController.getUserByEmail(req.params.email);
    return responseSuccess(res, user, 'Lấy theo email thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.NOT_FOUND, err.message);
  }
});

router.get('/token/:token', async (req: Request, res: Response) => {
  try {
    const user = await UserController.getUserByToken(req.params.token);
    return responseSuccess(res, user, 'Lấy theo token thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.NOT_FOUND, err.message);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = await UserController.createUser(req.body);
    return responseSuccess(res, newUser, 'Tạo người dùng thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedUser = await UserController.updateUser(req.params.id, req.body);
    return responseSuccess(res, updatedUser, 'Cập nhật thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.BAD_REQUEST, err.message);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedUser = await UserController.deleteUser(req.params.id);
    return responseSuccess(res, deletedUser, 'Xoá người dùng thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.NOT_FOUND, err.message);
  }
});

export default router;
