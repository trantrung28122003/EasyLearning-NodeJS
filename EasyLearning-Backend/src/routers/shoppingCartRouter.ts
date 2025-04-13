import express, { Request, Response } from 'express';
import { check_authentication } from '../utils/authen';
import * as ShoppingCartController from '../controllers/shoppingCartController'
import * as ShoppingCartItemController from '../controllers/shoppingCartItemController'
import * as CourseController from '../controllers/courseController'
import * as DiscountController from '../controllers/discountController'
import { HttpCode } from "../enums/httpCode";
import { responseError, responseSuccess } from '../utils/responseHandler';

const router = express.Router();


router.get('/', check_authentication, async (req: Request, res: Response) => {
  try {
  
    const currentUser = (req as any).user;
    const shoppingCart = await ShoppingCartController.getShoppingCartByUser(currentUser._id);
    return responseSuccess(res, shoppingCart);
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


router.post('/add-to-cart', check_authentication, async (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId as string;
    const currentUser = (req as any).user;
    const isCourseFull = await CourseController.isCourseOfflineFull(courseId);
    const isRegistrationDateExpired = await CourseController.isRegistrationDateExpired(courseId);

    if (isCourseFull && isRegistrationDateExpired) {
      return responseError(res, 400, "Khóa học đã đầy và ngày đăng ký đã hết hạn");
    } else if (isRegistrationDateExpired) {
      return responseError(res, 401, "Ngày đăng ký đã hết hạn");
    } else if (isCourseFull) {
      return responseError(res, 402, "Khóa học đã đầy số lượng đăng ký");
    } else {
      const cartItem = await ShoppingCartItemController.createShoppingCartItem(courseId, currentUser._id);
      return responseSuccess(res, cartItem);
    }
  } catch (err: any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


router.post('/remove-card', check_authentication, async (req: Request, res: Response) => {
  try {
    const shoppingCartItemId = req.query.shoppingCartItemId as string;
    await ShoppingCartItemController.deleteShoppingCartItem(shoppingCartItemId);
    return responseSuccess(res, { message: 'ShoppingCartItem has been soft deleted' });
  } catch (err:any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

router.get('/inCart/:courseId', check_authentication, async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const currentUser = (req as any).user;
    const isInCart = await ShoppingCartController.isCourseInCart(courseId, currentUser._id);
    return responseSuccess(res, isInCart);
  } catch (err : any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});


router.post('/applyDiscount', check_authentication, async (req: Request, res: Response) => {
  try {
    const { discountCode } = req.body;
    const currentUser = (req as any).user;
    const response = await DiscountController.applyDiscount(discountCode, currentUser, );
    return responseSuccess(res, response);
  } catch (err:any) {
    return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
  }
});

export default router;
