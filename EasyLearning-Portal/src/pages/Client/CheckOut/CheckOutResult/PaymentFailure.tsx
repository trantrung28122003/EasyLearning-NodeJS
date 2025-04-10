import { useNavigate } from "react-router-dom";
import "./CheckOutResult.css"; 
import ClientShared from "../../Shared/ClientShared";

const PaymentFailure = () => {
  const navigate = useNavigate(); 

  return (
    <ClientShared>
      <div className="payment-container">
        <img
          src="https://cdn-icons-png.freepik.com/256/11450/11450177.png"
          alt="Failure"
        />
        <h1>Thanh toán thất bại!</h1>
        <p style={{ fontSize: "20px", marginBottom: "40px" }}>
          Rất tiếc, thanh toán của bạn không thành công. Có lỗi xảy ra trong quá
          trình xử lý thanh toán.
        </p>
        <p>
          Đừng lo lắng! Bạn có thể thử lại sau hoặc chọn một phương thức thanh
          toán khác.
        </p>
        <button
          className="flex-shrink-0 btn btn-sm btn-primary px-3 btn-payment"
          onClick={() => navigate("/shoppingCart ", { replace: true })}
        >
          Quay lại giỏ hàng của bạn
        </button>
      </div>
    </ClientShared>
  );
};

export default PaymentFailure;
