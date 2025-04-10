import { useSearchParams, useNavigate } from "react-router-dom";

import { HTTP_OK } from "../../../../constants/HTTPCode";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { useEffect, useRef, useState } from "react";
import ClientShared from "../../Shared/ClientShared";
import "./CheckOutResult.css";
import { CONFIRM_PAYMENT_VNPAY } from "../../../../constants/API";

const CheckoutResult = () => {
  let [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const hasCalledAPI = useRef(false);
  const isAwaitingPaymentConfirmation = sessionStorage.getItem(
    "isAwaitingPaymentConfirmation"
  );

  const request = {
    partnerCode: searchParams.get("vnp_PartnerCode") ?? "",
    accessKey: searchParams.get("vnp_AccessKey") ?? "",
    requestId: searchParams.get("vnp_RequestId") ?? "",
    amount: searchParams.get("vnp_Amount") ?? "",
    orderId: searchParams.get("vnp_OrderId") ?? "",
    orderInfo: searchParams.get("vnp_OrderInfo") ?? "",
    orderType: searchParams.get("vnp_OrderType") ?? "",
    transId: searchParams.get("vnp_TransId") ?? "",
    message: searchParams.get("vnp_Message") ?? "",
    localMessage: searchParams.get("vnp_LocalMessage") ?? "",
    responseTime: searchParams.get("vnp_ResponseTime") ?? "",
    errorCode: searchParams.get("vnp_ResponseCode") ?? "11",
    payType: searchParams.get("vnp_PayType") ?? "",
    extraData: searchParams.get("vnp_ExtraData") ?? "",
    signature: searchParams.get("vnp_SecureHash") ?? "",
  };

  const doCallConfirmPayment = () => {
    if (hasCalledAPI.current) return;
    setIsLoading(true);
    DoCallAPIWithToken(CONFIRM_PAYMENT_VNPAY, "post", request)
      .then((res) => {
        if (res.data.code === HTTP_OK) {
          navigate("/paymentSuccess", { replace: true });
        } else {
          navigate("/paymentFailure", { replace: true });
        }
      })
      .catch()
      .finally(() => {
        setIsLoading(false);
        hasCalledAPI.current = true;
      });
  };

  useEffect(() => {
    if (
      request.errorCode === "00" &&
      isAwaitingPaymentConfirmation === "false"
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 15000);
      navigate("/paymentSuccess", { replace: true });
      sessionStorage.removeItem("isAwaitingPaymentConfirmation");
    } else if (
      request.errorCode !== "00" &&
      isAwaitingPaymentConfirmation === "false"
    ) {
      navigate("/paymentFailure", { replace: true });
      sessionStorage.removeItem("isAwaitingPaymentConfirmation");
    } else if (
      !hasCalledAPI.current &&
      isAwaitingPaymentConfirmation === "true"
    ) {
      sessionStorage.setItem("isAwaitingPaymentConfirmation", "false");
      doCallConfirmPayment();
    }
    hasCalledAPI.current = true;
  }, []);

  return (
    <ClientShared>
      {isLoading && (
        <div className="checkout-result-overlay">
          <div className="spinner"></div>
          <p className="loading-text">
            eLEARNING Đang thực hiện thanh toán khóa học của bạn
          </p>
        </div>
      )}
    </ClientShared>
  );
};

export default CheckoutResult;
