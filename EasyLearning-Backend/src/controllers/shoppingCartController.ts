import ShoppingCart from '../models/shoppingCart';
import ShoppingCartItem from '../models/shoppingCartItem';
import Course from '../models/course';
import { Types } from 'mongoose';
import * as CourseController from './courseController';
import * as DiscountController from './discountController';


export const getShoppingCartById = async (id: string) => {
    const shoppingCart = await ShoppingCart.findById(id);
    if (!shoppingCart) {
      throw new Error(`ShoppingCart not found with id: ${id}`);
    }
    return shoppingCart;
  };
  
  export const calculateTotalPrice = async (shoppingCartItems: any[]): Promise<number> => {
    let totalPrice = 0;
    for (const item of shoppingCartItems) {
      totalPrice += Number(item.cartItemPrice);
    }
    return totalPrice;
  };
  
  export const calculateTotalPriceDiscount = async (shoppingCartItemResponses: any[]): Promise<number> => {
    let totalPriceDiscount = 0;
    for (const item of shoppingCartItemResponses) {
      totalPriceDiscount += Number(item.cartItemPriceDiscount);
    }
    return totalPriceDiscount;
  };

export const getShoppingCartByUser = async (currentUserId: string) => {

    const shoppingCart = await ShoppingCart.findOne({ user: currentUserId, isDeleted: false });
    if (!shoppingCart) {
      throw new Error('Không tìm thấy giỏ hàng.');
    }

    const items = await ShoppingCartItem.find({
      shoppingCart: shoppingCart._id,
      isDeleted: false,
    });

    let totalPrice = 0;
    let totalPriceDiscount = 0;

    const shoppingCartItemResponses = await Promise.all(
      items.map(async (item) => {
        const course = await Course.findById(item.course._id);
        if (!course){
            throw new Error('Không tìm thấy khóa học.');
        }

        const discountedPrice = await DiscountController.applyCourseDiscount(course._id!.toString(), course.coursePrice);

        const isFull = await CourseController.isCourseOfflineFull(course._id!.toString());
        const isExpired = await CourseController.isRegistrationDateExpired(course._id!.toString());
        const notRegistrable : boolean = isFull || isExpired;

        item.cartItemPriceDiscount = discountedPrice;
        await item.save();

        totalPrice += Number(item.cartItemPrice);
        totalPriceDiscount += Number(discountedPrice);

        return {
          id: item._id,
          cartItemName: item.cartItemName,
          cartItemPrice: item.cartItemPrice,
          cartItemPriceDiscount: discountedPrice,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          courseId: item.course._id,
          notRegistrable,
        };
      })
    );

    shoppingCart.totalPrice = totalPrice;
    shoppingCart.totalPriceDiscount = totalPriceDiscount;
    await shoppingCart.save();

    return {
      id: shoppingCart._id,
      totalPrice,
      totalPriceDiscount,
      userId: shoppingCart.user,
      shoppingCartItems: shoppingCartItemResponses.filter(i => i !== null),
      createdAt: shoppingCart.createdAt,
      updatedAt: shoppingCart.updatedAt,
      isDeleted: shoppingCart.isDeleted,
    };
};

export const createShoppingCart = async (userId: string) => {
 
    const cart = await ShoppingCart.create({
      user: new Types.ObjectId(userId),
      totalPrice: 0,
      totalPriceDiscount: 0,
      changedBy: userId
    });
    return cart;
};


export const isCourseInCart = async ( courseId: string, currentUserId: string): Promise<boolean> => {
    const shoppingCart = await ShoppingCart.findOne({ user: currentUserId, isDeleted: false });
    if (!shoppingCart) {
      return false;
    }
  
    const shoppingCartItems = await ShoppingCartItem.find({
      shoppingCart: shoppingCart._id,
      isDeleted: false,
    });
  
    for (const item of shoppingCartItems) {
      if (item.course.toString() === courseId) {
        return true;
      }
    }
    return false;
  };
