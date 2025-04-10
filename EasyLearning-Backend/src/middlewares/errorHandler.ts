import { Request, Response, NextFunction } from 'express';
import { responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || HttpCode.INTERNAL_SERVER;  
  const message = err.message || 'Internal Server Error';  
  responseError(res, status, message); 
};
