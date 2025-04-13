import axios from 'axios';
import crypto from 'crypto';

interface MoMoResponse {
    payUrl?: string;
    [key: string]: any;
}

export async function doPaymentMOMO(amount: number, orderInfo: string): Promise<string | null> {
  try {
    const endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
    const partnerCode = process.env.MOMO_PARTNER_CODE || '';
    const accessKey = process.env.MOMO_ACCESS_KEY || '';
    const secretKey = process.env.MOMO_SECRET_KEY || '';
    const returnUrl = process.env.MOMO_RETURN_URL || '';
    const notifyUrl = process.env.MOMO_NOTIFY_URL || '';
    const orderId = Date.now().toString();
    const requestId = Date.now().toString();
    const extraData = "";
    const encodedOrderInfo = encodeURIComponent(orderInfo);
    const rawHash = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${returnUrl}&notifyUrl=${notifyUrl}&extraData=${extraData}`;

    const signature = signSHA256(rawHash, secretKey);
    const message = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      returnUrl,
      notifyUrl,
      extraData,
      requestType: "captureMoMoWallet",
      signature
    };

    const response = await axios.post<MoMoResponse>(endpoint, message);
   
    const data = response.data;
    if (data.payUrl ) {
      return data.payUrl;
    } else {
      console.error("Không tìm thấy khóa 'payUrl' trong phản hồi từ Momo.");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}


function signSHA256(message: string, key: string): string {
  try {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('hex');
  } catch (error) {
    console.error(error);
    return '';
  }
}
