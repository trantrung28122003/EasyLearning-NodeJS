import { useSearchParams, useNavigate } from "react-router-dom";

import { HTTP_OK } from "../../../../constants/HTTPCode";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { useEffect, useRef, useState } from "react";
import ClientShared from "../../Shared/ClientShared";
import "./CheckOutResult.css";
import { CONFIRM_PAYMENT_MOMO } from "../../../../constants/API";

const CheckoutResult = () => {
  let [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const hasCalledAPI = useRef(false);
  const isAwaitingPaymentConfirmation = sessionStorage.getItem(
    "isAwaitingPaymentConfirmation"
  );

  const request = {
    partnerCode: searchParams.get("partnerCode") ?? "",
    accessKey: searchParams.get("accessKey") ?? "",
    requestId: searchParams.get("requestId") ?? "",
    amount: searchParams.get("amount") ?? "",
    orderId: searchParams.get("orderId") ?? "",
    orderInfo: searchParams.get("orderInfo") ?? "",
    orderType: searchParams.get("orderType") ?? "",
    transId: searchParams.get("transId") ?? "",
    message: searchParams.get("message") ?? "",
    localMessage: searchParams.get("localMessage") ?? "",
    responseTime: searchParams.get("responseTime") ?? "",
    errorCode: searchParams.get("errorCode") ?? "",
    payType: searchParams.get("payType") ?? "",
    extraData: searchParams.get("extraData") ?? "",
    signature: searchParams.get("signature") ?? "",
  };

  const doCallConfirmPayment = () => {
    if (hasCalledAPI.current) return;
    sessionStorage.removeItem("discountCode");
    setIsLoading(true);
    DoCallAPIWithToken(CONFIRM_PAYMENT_MOMO, "post", request)
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
      request.errorCode === "0" &&
      isAwaitingPaymentConfirmation === "false"
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      navigate("/paymentSuccess", { replace: true });
      sessionStorage.removeItem("isAwaitingPaymentConfirmation");
    } else if (
      request.errorCode !== "0" &&
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
