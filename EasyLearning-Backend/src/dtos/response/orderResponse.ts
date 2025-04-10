interface OrderDetailResponse {
    price: number;
    priceDiscount: number;
    courseName: string;
    isFree: boolean;
    orderDate: Date;
  }
  
  interface PurchaseHistoryResponse {
    initialAmount: number;
    discountedAmount: number;
    dateOfFirstPurchase: Date | null;
    dateOfLatestPurchase: Date | null;
    orderDetailResponseList: OrderDetailResponse[];
  }
  