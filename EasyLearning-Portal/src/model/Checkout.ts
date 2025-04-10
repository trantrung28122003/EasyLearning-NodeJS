interface MomoPaymentRequest {
  amount: string;
  note: string;
}

interface VNPaymentRequest {
  amount: number;
}

interface ConfirmPaymentRequest {
  partnerCode: string;
  accessKey: string;
  requestId: string;
  amount: string;
  orderId: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  message: string;
  localMessage: string;
  responseTime: string;
  errorCode: string;
  payType: string;
  extraData: string;
  signature: string;
}
