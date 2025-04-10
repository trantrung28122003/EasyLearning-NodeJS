import { Response } from 'express';  
import { ApiResponse } from './apiResponse';  
import { HttpCode } from '../enums/httpCode';

export const responseSuccess = <T>(res: Response, data: T, message = 'Success'): void => {
  const response: ApiResponse<T> = {
    code: HttpCode.OK,
    message,
    result: data,
  };
  res.status(HttpCode.OK).send(response); 
};

export const responseError = (res: Response, code: number = HttpCode.INTERNAL_SERVER, message: string): void => {
  const response: ApiResponse<null> = {
    code,
    message,
    result: null,
  };
  res.status(code).send(response);
};

export const responseCookie = (res: Response, key: string, value: string, exp: number): void => {
  res.cookie(key, value, {
    httpOnly: true,
    expires: new Date(exp),
    signed: true,
  });
};