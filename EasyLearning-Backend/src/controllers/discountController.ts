import Discount from '../models/discount';
import CourseDiscount from '../models/courseDiscount';
import UserDiscount from '../models/userDiscount';
import ShoppingCart from '../models/shoppingCart';
import { Types } from 'mongoose';
import { ApplyDiscountResponse } from '../dtos/response/applyDiscountResponse';

export const createDiscount = async (data: any) => {
  const newDiscount = new Discount(data);
  return await newDiscount.save();
};

export const getAllDiscounts = async () => {
  return await Discount.find();
};

export const getDiscountByCode = async (discountCode: string) => {
  return await Discount.findOne({ discountCode });
};

export const applyCourseDiscount = async (courseId: string, originalPrice: number) => {
  const courseDiscounts = await CourseDiscount.find({ courseId });
  let discountedPrice = originalPrice;

  for (const courseDiscount of courseDiscounts) {
    if (courseDiscount.active && !courseDiscount.isCodeRequired) {
      const discount = await Discount.findById(courseDiscount._id);
      if (!discount) continue;

      if (discount.discountType === 'PERCENT') {
        const percent = (originalPrice * discount.value) / 100;
        discountedPrice -= percent;
      }

      if (discount.discountType === 'FIXED') {
        discountedPrice -= discount.value;
      }
    }
  }
  return Math.max(Math.round(discountedPrice), 0);
};

export const checkDiscountUsed = async (userId: string, discountId: string) => {
  const used = await UserDiscount.findOne({ userId, discountId, isUsed: true });
  return !!used;
};

export const applyDiscount = async (shoppingCartId: string, discountCode: string, currentUserId: string) => {
  const shoppingCart = await ShoppingCart.findById(shoppingCartId);
  if (!shoppingCart) throw new Error('Không tìm thấy giỏ hàng');

  const discount = await Discount.findOne({ discountCode });
  if (!discount) throw new Error('Mã giảm giá không hợp lệ');


  const userUsed = await checkDiscountUsed(currentUserId, discount._id!.toString());
  if (userUsed) throw new Error('Bạn đã sử dụng mã giảm giá này rồi');

  if (discount.endDate && new Date(discount.endDate) < new Date())
    throw new Error('Mã giảm giá đã hết hạn');

  if (discount.usageLimit && discount.usageCount >= discount.usageLimit)
    throw new Error('Mã giảm giá đã đạt giới hạn sử dụng');

  let discountedPrice: Types.Decimal128 = shoppingCart.totalPriceDiscount;

  let priceValue = parseFloat(discountedPrice.toString());

    if (discount.discountType === 'PERCENT') {
    const percent = (priceValue * discount.value) / 100;
    priceValue -= percent;
    }

    if (discount.discountType === 'FIXED') {
    priceValue -= discount.value;
    }

    const finalPrice = Math.max(Math.round(priceValue), 0);

    const applyDiscountResponse: ApplyDiscountResponse = {
        discountCode: discount.discountCode,
        discountName: discount.discountName,
        value: discount.value,
        priceDiscount: finalPrice
        };
    return applyDiscountResponse;
};

export const updateUserDiscount = async (discountCode: string, currentUserId: string) => {
  const discount = await Discount.findOne({ discountCode });
  if (!discount) throw new Error('Mã giảm giá không hợp lệ');

  const userDiscount = await UserDiscount.findOne({
    userId: currentUserId,
    discountId: discount._id,
    isUsed: false
  });

  if (!userDiscount) throw new Error('Mã giảm giá đã được sử dụng hoặc không hợp lệ');

  userDiscount.isUsed = true;
  await userDiscount.save();

  return true;
};

export const getAllDiscountByUser = async (currentUserId :string) => {
  const userDiscounts = await UserDiscount.find({
    userId: currentUserId,
    isUsed: false
  });

  const result = [];
  for (const userDiscount of userDiscounts) {
    const discount = await Discount.findById(userDiscount._id);
    if (!discount) continue;
    result.push({
      discountCode: discount.discountCode,
      discountDescription: discount.description
    });
  }
  return result;
};
