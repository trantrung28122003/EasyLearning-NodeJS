import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckOutResult.css";
import ClientShared from "../../Shared/ClientShared";
import { UPDATE_DISCOUNT_USER } from "../../../../constants/API";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { HTTP_OK } from "../../../../constants/HTTPCode";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState<string | null>(
    sessionStorage.getItem("discountCode")
  );

  const doCallApplyUserDiscount = async () => {
    try {
      console.log("Calling API with discountCode:", discountCode);
      const URL = UPDATE_DISCOUNT_USER + `?discountCode=${discountCode}`;
      const response = await DoCallAPIWithToken(URL, "POST");
      if (response.data.code === HTTP_OK) {
        const data = response.data.result;
        console.log(data);
        sessionStorage.removeItem("discountCode");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  useEffect(() => {
    const storedDiscountCode = sessionStorage.getItem("discountCode");
    if (storedDiscountCode) {
      setDiscountCode(storedDiscountCode);
    }
    doCallApplyUserDiscount();
  }, []);

  return (
    <ClientShared>
      <div className="payment-success-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSidAhRFQqE4Lo0rK6771JOB_yxsk2hLVp8An4r8rP_RQ&s"
          alt="Success"
        />
        <h1>THANH TOÁN THÀNH CÔNG</h1>
        <p style={{ fontSize: "20px", marginBottom: "40px" }}>
          Chúng tôi rất vui khi bạn lựa chọn chúng tôi để nâng cao kiến thức và
          phát triển bản thân qua các khóa học.
        </p>
        <div>
          Đừng ngần ngại liên hệ với chúng tôi nếu bạn gặp bất kỳ vấn đề gì
          trong quá trình học.
        </div>
        <p>
          Cảm ơn bạn đã tin tưởng và đồng hành cùng chúng tôi trong hành trình
          học tập!
        </p>
        <button
          className="flex-shrink-0 btn btn-sm btn-primary px-3 btn-payment"
          onClick={() => navigate("/userCourses", { replace: true })}
        >
          Đi tới khóa học của bạn
        </button>
      </div>
    </ClientShared>
  );
};

export default PaymentSuccess;
