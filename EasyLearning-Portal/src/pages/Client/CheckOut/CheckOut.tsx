import React, { useEffect, useState } from "react";
import "./CheckOut.css";
import ClientShared from "../Shared/ClientShared";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import {
  BASE_URL_SHOPPING_CART,
  DO_PAYMENT_MOMO,
  DO_PAYMENT_VNPAY,
} from "../../../constants/API";
import { HTTP_OK } from "../../../constants/HTTPCode";
import { formatCurrency } from "../../../hooks/useCurrency";
import { getUserInfo } from "../../../hooks/useLogin";
import { useLocation } from "react-router-dom";
const CheckOut: React.FC = () => {
  const location = useLocation();
  const { totalPriceDiscount } = location.state || {};
  const [discountCode, setDiscountCode] = useState<String | null>(null);
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>();
  const [selectedPayment, setSelectedPayment] = useState<string>("MOMO");
  const currentUser = getUserInfo();
  const doGetShoppingCart = () => {
    DoCallAPIWithToken(BASE_URL_SHOPPING_CART, "get").then((res) => {
      if (res.status === HTTP_OK) {
        const shoppingCart: ShoppingCart = res.data;
        setShoppingCart(shoppingCart);
      }
    });
  };
  const doPayment = () => {
    if (shoppingCart) {
      const payloadMomo: MomoPaymentRequest = {
        amount: totalPriceDiscount.toString(),
        note: "thanhtoan",
      };

      if (selectedPayment === "MOMO") {
        DoCallAPIWithToken(DO_PAYMENT_MOMO, "post", payloadMomo).then((res) => {
          if (res.status === HTTP_OK) {
            window.location.href = res.data;
            sessionStorage.setItem("isAwaitingPaymentConfirmation", "true");
          }
        });
      } else if (selectedPayment == "VNPAY") {
        const URL = DO_PAYMENT_VNPAY + `?amount=${totalPriceDiscount}`;
        console.log("Ủlllll", URL);
        DoCallAPIWithToken(URL, "get").then((res) => {
          if (res.status === HTTP_OK) {
            window.location.href = res.data;
            sessionStorage.setItem("isAwaitingPaymentConfirmation", "true");
          }
        });
      }
    }
  };

  useEffect(() => {
    setDiscountCode(sessionStorage.getItem("discountCode"));
    doGetShoppingCart();
  }, []);
  return (
    <ClientShared>
      <div className="container checkout-body">
        <div className="text-center">
          <div className="title-text">
            <h1
              className="h2-text-center"
              style={{ marginTop: "28px", color: "#06BBCC" }}
            >
              THANH TOÁN KHÓA HỌC
            </h1>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-lg-7 ">
            <div className="accordion payment" id="accordionPayment">
              <h1 className="h3">Các phương thức thanh toán </h1>

              <div
                className="checkout-card mb-3"
                onClick={() => setSelectedPayment("MOMO")}
              >
                <h2 className="h5 px-4 py-3 accordion-header d-flex justify-content-between align-items-center">
                  <div
                    className="w-100 collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseMOMO"
                    aria-expanded="false"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="paymentMOMO"
                      checked={selectedPayment === "MOMO"}
                      onChange={() => setSelectedPayment("MOMO")}
                    />
                    <label className="form-check-label pt-1">Ví Momo</label>
                  </div>
                  <img src="https://res.cloudinary.com/dofr3xzmi/image/upload/v1734677185/momo_logo_wjyk8g.svg"></img>
                </h2>
                <div
                  id="collapseMOMO"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#accordionPayment"
                >
                  <div className="checkout-card-body">
                    <p>Thanh toán quét mã QRCode trên app MOMO</p>
                  </div>
                </div>
              </div>

              <div
                className="checkout-card mb-3"
                onClick={() => setSelectedPayment("VNPAY")}
              >
                <h2 className="h5 px-4 py-3 accordion-header d-flex justify-content-between align-items-center">
                  <div
                    className="w-100 collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseVNPAY"
                    aria-expanded="false"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="paymentMOMO"
                      checked={selectedPayment === "VNPAY"}
                      onChange={() => setSelectedPayment("VNPAY")}
                    />
                    <label className="form-check-label pt-1">Ví VNPay</label>
                  </div>

                  <img src="https://res.cloudinary.com/dofr3xzmi/image/upload/v1734677228/vnpay_logo_rm6iyp.svg"></img>
                </h2>
                <div
                  id="collapseVNPAY"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionPayment"
                >
                  <div className="checkout-card-body">
                    <p>
                      Hệ thống chỉ nhận thanh toán bẵng mã thẻ! Chưa hỗ trợ
                      thanh toán QRCode với VNpay
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="checkout-card position-sticky top-0">
              <div className="p-3 bg-opacity-10">
                <h5 className="card-title mb-3 text-center">Tổng thanh toán</h5>
                <h6 className="card-title mb-3">Danh sách khóa học:</h6>
                <ul className="list-group mb-4">
                  {shoppingCart?.shoppingCartItemResponses.map(
                    (shopingCartItem, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{shopingCartItem.cartItemName}</span>

                        <span>
                          {shopingCartItem.cartItemPrice !=
                            shopingCartItem.cartItemPriceDiscount && (
                            <small
                              style={{
                                textDecoration: "line-through",
                                marginRight: "12px",
                              }}
                            >
                              {formatCurrency(shopingCartItem.cartItemPrice)}₫
                            </small>
                          )}
                          {formatCurrency(
                            shopingCartItem.cartItemPriceDiscount
                          )}
                          ₫
                        </span>
                      </li>
                    )
                  )}
                </ul>
                <div className="d-flex justify-content-between mb-1">
                  <span>Tổng tiền các khóa học</span>
                  <span>{formatCurrency(shoppingCart?.totalPrice)}₫</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  {shoppingCart?.totalPrice !=
                    shoppingCart?.totalPriceDiscount && (
                    <>
                      <span>Giảm giá của khóa học</span>
                      <span>
                        -{" "}
                        {shoppingCart &&
                          formatCurrency(
                            shoppingCart?.totalPrice -
                              shoppingCart?.totalPriceDiscount
                          )}
                        ₫
                      </span>
                    </>
                  )}
                </div>
                {discountCode && (
                  <div className="d-flex justify-content-between mb-1">
                    <span>Mã giảm giá</span>
                    <span>
                      -{" "}
                      {shoppingCart &&
                        formatCurrency(
                          shoppingCart?.totalPriceDiscount - totalPriceDiscount
                        )}
                      ₫
                    </span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span>Tổng số tiền thanh toán</span>
                  <h4 className="text-dark">
                    {formatCurrency(totalPriceDiscount)}₫
                  </h4>
                </div>
                <div className="form-check mb-3 ">
                  <label className="form-check-label" htmlFor="subscribe">
                    Hóa đơn này sẽ được gửi tới{" "}
                    <a className="text-custom">{currentUser?.email}</a> Vui lòng
                    kiểm tra gmail của bạn.
                  </label>
                </div>
                <button
                  className="btn-checkout btn btn-primary w-100 mt-2"
                  onClick={() => {
                    doPayment();
                  }}
                >
                  Thanh Toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientShared>
  );
};
export default CheckOut;
