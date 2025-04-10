interface ShoppingCart {
  id: string;
  totalPrice: number;
  shoppingCartItemResponses: ShoppingCartItem[];
  totalPriceDiscount : number;
  userId: string;
  dateCreate?: any;
  dateChange?: any;
  changedBy?: any;
  deleted: boolean;
}
interface ShoppingCartItem {
  id: string;
  cartItemName: string;
  quantity?: any;
  imageUrl: string;
  cartItemPrice: number;
  cartItemPriceDiscount : number;
  shoppingCartId: string;
  courseId: string;
  dateCreate: string;
  dateChange: string;
  changedBy: string;
  deleted: boolean;
  notRegistrable: boolean;
}

interface UserDiscountResponse {
  discountCode : string;
  discountDescription: string;
}
