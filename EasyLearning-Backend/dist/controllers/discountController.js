"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDiscountByUser = exports.updateUserDiscount = exports.applyDiscount = exports.checkDiscountUsed = exports.applyCourseDiscount = exports.getDiscountByCode = exports.getAllDiscounts = exports.createDiscount = void 0;
const discount_1 = __importDefault(require("../models/discount"));
const courseDiscount_1 = __importDefault(require("../models/courseDiscount"));
const userDiscount_1 = __importDefault(require("../models/userDiscount"));
const shoppingCart_1 = __importDefault(require("../models/shoppingCart"));
const createDiscount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newDiscount = new discount_1.default(data);
    return yield newDiscount.save();
});
exports.createDiscount = createDiscount;
const getAllDiscounts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield discount_1.default.find();
});
exports.getAllDiscounts = getAllDiscounts;
const getDiscountByCode = (discountCode) => __awaiter(void 0, void 0, void 0, function* () {
    return yield discount_1.default.findOne({ discountCode });
});
exports.getDiscountByCode = getDiscountByCode;
const applyCourseDiscount = (courseId, originalPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const courseDiscounts = yield courseDiscount_1.default.find({ courseId });
    let discountedPrice = originalPrice;
    for (const courseDiscount of courseDiscounts) {
        if (courseDiscount.active && !courseDiscount.isCodeRequired) {
            const discount = yield discount_1.default.findById(courseDiscount._id);
            if (!discount)
                continue;
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
});
exports.applyCourseDiscount = applyCourseDiscount;
const checkDiscountUsed = (userId, discountId) => __awaiter(void 0, void 0, void 0, function* () {
    const used = yield userDiscount_1.default.findOne({ userId, discountId, isUsed: true });
    return !!used;
});
exports.checkDiscountUsed = checkDiscountUsed;
const applyDiscount = (shoppingCartId, discountCode, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const shoppingCart = yield shoppingCart_1.default.findById(shoppingCartId);
    if (!shoppingCart)
        throw new Error('Không tìm thấy giỏ hàng');
    const discount = yield discount_1.default.findOne({ discountCode });
    if (!discount)
        throw new Error('Mã giảm giá không hợp lệ');
    const userUsed = yield (0, exports.checkDiscountUsed)(currentUserId, discount._id.toString());
    if (userUsed)
        throw new Error('Bạn đã sử dụng mã giảm giá này rồi');
    if (discount.endDate && new Date(discount.endDate) < new Date())
        throw new Error('Mã giảm giá đã hết hạn');
    if (discount.usageLimit && discount.usageCount >= discount.usageLimit)
        throw new Error('Mã giảm giá đã đạt giới hạn sử dụng');
    let discountedPrice = shoppingCart.totalPriceDiscount;
    let priceValue = parseFloat(discountedPrice.toString());
    if (discount.discountType === 'PERCENT') {
        const percent = (priceValue * discount.value) / 100;
        priceValue -= percent;
    }
    if (discount.discountType === 'FIXED') {
        priceValue -= discount.value;
    }
    const finalPrice = Math.max(Math.round(priceValue), 0);
    const applyDiscountResponse = {
        discountCode: discount.discountCode,
        discountName: discount.discountName,
        value: discount.value,
        priceDiscount: finalPrice
    };
    return applyDiscountResponse;
});
exports.applyDiscount = applyDiscount;
const updateUserDiscount = (discountCode, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield discount_1.default.findOne({ discountCode });
    if (!discount)
        throw new Error('Mã giảm giá không hợp lệ');
    const userDiscount = yield userDiscount_1.default.findOne({
        userId: currentUserId,
        discountId: discount._id,
        isUsed: false
    });
    if (!userDiscount)
        throw new Error('Mã giảm giá đã được sử dụng hoặc không hợp lệ');
    userDiscount.isUsed = true;
    yield userDiscount.save();
    return true;
});
exports.updateUserDiscount = updateUserDiscount;
const getAllDiscountByUser = (currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const userDiscounts = yield userDiscount_1.default.find({
        userId: currentUserId,
        isUsed: false
    });
    const result = [];
    for (const userDiscount of userDiscounts) {
        const discount = yield discount_1.default.findById(userDiscount._id);
        if (!discount)
            continue;
        result.push({
            discountCode: discount.discountCode,
            discountDescription: discount.description
        });
    }
    return result;
});
exports.getAllDiscountByUser = getAllDiscountByUser;
