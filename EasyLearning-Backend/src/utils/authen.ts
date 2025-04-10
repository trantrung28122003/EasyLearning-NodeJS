import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as userController from '../controllers/userController';
import { IUser } from '../models/user';
import { responseError } from './responseHandler';
import { HttpCode } from '../enums/httpCode'

interface JwtPayload {
  id: string;
  exp: number;
}

export const check_authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;


    if (req.headers && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token && req.signedCookies?.token) {
      token = req.signedCookies.token;
    }

    if (!token) {
      return responseError(res, HttpCode.UNAUTHORIZED, "Bạn chưa đăng nhập");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
    } catch (err) {
      return responseError(res, HttpCode.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn");
    }

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return responseError(res, HttpCode.UNAUTHORIZED, "Phiên đăng nhập đã hết hạn");
    }

    const user: IUser | null = await userController.getUserById(decoded.id);

    if (!user) {
      return responseError(res, HttpCode.NOT_FOUND, "Không tìm thấy người dùng");
    }
    
    (req as any).user = user;
    next();
  } catch (err) {
    return responseError(res, HttpCode.INTERNAL_SERVER, "Xác thực thất bại");
  }
};


export const check_authorization = (requiredRoles: string[]) => {

  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const userRole = user?.roles?.name;
    if (!userRole || !requiredRoles.includes(userRole)) {
        return responseError(res, HttpCode.FORBIDDEN, 'Bạn không có quyền truy cập');
    }
    next();
  };
};
