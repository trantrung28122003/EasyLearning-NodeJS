import ShoppingCartItem from '../models/shoppingCartItem';
import ShoppingCart from '../models/shoppingCart';
import Course from '../models/course';
import * as DiscountController  from './discountController';


export const getAllShoppingCartItems = async () => {
    return await ShoppingCartItem.find();
};

export const getShoppingCartItemById = async (id: string) => {
    const item = await ShoppingCartItem.findById(id);
    if (!item) throw new Error(`Không tìm thấy item shoppingcart: ${id}`);
    return item;
};

export const getShoppingCartItemByShoppingCart = async (shoppingCartId: string) => {
    return await ShoppingCartItem.find({ shoppingCart: shoppingCartId });
};

export const createShoppingCartItem = async (courseId: string, currentUserId: string) => {
    const course = await Course.findById(courseId);
    if (!course) throw new Error(`Course not found with id: ${courseId}`);

    const shoppingCart = await ShoppingCart.findOne({ user: currentUserId });
    if (!shoppingCart) throw new Error('Giỏ hàng không tồn tại');

    const coursePriceDiscount = await DiscountController.applyCourseDiscount(
        course._id!.toString(),
        course.coursePrice
    );

    const shoppingCartItem = new ShoppingCartItem({
        cartItemName: course.courseName,
        cartItemPrice: course.coursePrice,
        imageUrl: course.imageUrl,
        quantity: 1,
        cartItemPriceDiscount: coursePriceDiscount,
        shoppingCart: shoppingCart._id,
        course: course._id,
        changedBy: currentUserId,
        isDeleted: false
    });

    return await shoppingCartItem.save();
};

export const deleteShoppingCartItem = async (id: string) => {
    await ShoppingCartItem.findByIdAndDelete(id);
};
  



export const getShoppingCartItemsByCurrentUser = async (currentUserId: string) => {
  const shoppingCart = await ShoppingCart.findOne({ user: currentUserId });
  if (!shoppingCart) return [];
  return await ShoppingCartItem.find({ shoppingCart: shoppingCart._id })
  .populate({
    path: 'course', 

  })
  .lean();
};

export const softDeleteShoppingCartItemByCourseId = async (courseId: string) => {
  const items = await ShoppingCartItem.find({ course: courseId });
  for (const item of items) {
    item.isDeleted = true;
    await item.save();
  }
};

export const restoreShoppingCartItemByCourseId = async (courseId: string) => {
  const items = await ShoppingCartItem.find({ course: courseId });
  for (const item of items) {
    item.isDeleted = false;
    await item.save();
  }
};
