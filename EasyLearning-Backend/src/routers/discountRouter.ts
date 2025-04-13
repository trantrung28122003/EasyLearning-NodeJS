import { Router, Request, Response } from 'express';
import * as DiscountController from '../controllers/discountController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from '../enums/httpCode'; 
import { check_authentication } from '../utils/authen';

const router = Router();


router.post('/update-user-discount', check_authentication ,async (req: Request, res: Response) => {
  const { discountCode } = req.body;  
  try {
    const user = (req as any).user;
    const isUpdated = await DiscountController.updateUserDiscount(discountCode, user._id.toString()); 
    if (isUpdated) {
      return responseSuccess(res, null, 'Cập nhật mã thành công');
    } else {
      return responseError(res, HttpCode.BAD_REQUEST, 'Cập nhật mã thất bại');
    }
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message || 'Lỗi server');
  }
});


router.get('/get-all-discount-by-user', check_authentication, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const discounts = await DiscountController.getAllDiscountByUser(user._id.toString());
    return responseSuccess(res, discounts, 'Lấy danh sách mã giảm giá thành công');
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message || 'Lỗi server');
  }
});

export default router;
