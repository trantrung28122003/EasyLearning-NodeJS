import { Router, Request, Response } from 'express';; 
import * as PaymentController from '../controllers/paymentController'; 
import * as OrderController from '../controllers/orderController'; 
import { responseSuccess, responseError } from '../utils/responseHandler';
import { HttpCode } from "../enums/httpCode";
import { paymentValidator } from '../middlewares/validator';
import { check_authentication } from '../utils/authen';

const router = Router();

router.post('/do-payment-momo', paymentValidator, async (req: Request, res: Response) => {
    const { amount, note} = req.body;
  
    try {
      const paymentUrl = await PaymentController.doPaymentMOMO(amount, note);
      if (paymentUrl) {
        return responseSuccess(res, { payUrl: paymentUrl }, 'Tạo liên kết thanh toán thành công');
      } else {
        return responseError(res, HttpCode.BAD_REQUEST, 'Thanh toán thất bại');
      }
    } catch (error: any) {
      console.error(error);
      return responseError(res, HttpCode.INTERNAL_SERVER, error.message);
    }
  });


router.post('/confirm-payment-momo', check_authentication, async (req: Request, res: Response) => {
    const {
        partnerCode, accessKey, requestId, amount, orderId, orderInfo,
        orderType, transId, message, localMessage, responseTime,
        errorCode, payType, extraData, signature
    } = req.body;

    console.log('Xác nhận thanh toán nhận được:', req.body);
    const currentUser = (req as any).user;
    if (!currentUser) {
        return responseError(res, HttpCode.BAD_REQUEST, 'Người dùng không hợp lệ');
    }
    if (errorCode !== "0") {
        const paymentSuccess = await OrderController.processPaymentAndCreateOrder({
            amount,
            paymentMethod: 'MOMO',
            note: 'Thanh toán thành công',
        }, currentUser._id);

        if (paymentSuccess) {
            return responseSuccess(res, { code: 200, result: 'Thanh toán thành công và hóa đơn đã được tạo' });
        } else {
            return responseError(res, HttpCode.INTERNAL_SERVER, 'Không thể tạo hóa đơn');
        }
    } else {
        return responseError(res, HttpCode.BAD_REQUEST, `Thanh toán thất bại: ${message}`);
    }
});

export default router;
