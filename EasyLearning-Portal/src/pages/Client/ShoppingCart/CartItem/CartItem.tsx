import React from "react";
import style from "./CartItem.module.css";
import { REMOVE_FROM_CART } from "../../../../constants/API";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import { HTTP_OK } from "../../../../constants/HTTPCode";
import { formatCurrency } from "../../../../hooks/useCurrency";
interface CartItemProps {
  item: ShoppingCartItem;
}
const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const removeCartItem = () => {
    const URL = REMOVE_FROM_CART + "/" + item.id;
    DoCallAPIWithToken(URL, "post").then((res) => {
      if (res.status === HTTP_OK) {
        window.location.reload();
      }
    });
  };

  const handleDetailCourse = (courseId: string) => {
    const courseDetailUrl = "/course/" + courseId;
    window.open(courseDetailUrl, "_blank");
  };

  return (
    <>
      <div className={`card mb-4 ${style.item_wrapper}`}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-2">
              <img
                className="img-fluid"
                alt="Generic placeholder image"
                src={item.imageUrl}
              />
            </div>
            <div className="col-md-4 d-flex justify-content">
              <div>
                <p className="lead fw-normal mb-0" style={{ fontSize: "24px" }}>
                  {item.cartItemName}
                </p>
                {item.notRegistrable &&(
                  <small className="text-danger" >
                      Khóa học này đã hết hạn đăng kí hoặc đủ số lượng
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              {item.cartItemPrice !== item.cartItemPriceDiscount ? (
                <div>
                  <p
                    id="price"
                    className=" lead fw-normal mb-0 "
                    style={{ fontSize: "22px", fontWeight: "bold" }}
                  >
                    {formatCurrency(item?.cartItemPriceDiscount)}₫
                  </p>
                  <p
                    id="price"
                    className="lead fw-normal mb-0 "
                    style={{
                      fontSize: "18px",
                      color: "#888",
                      textDecoration: "line-through",
                    }}
                  >
                    {formatCurrency(item?.cartItemPrice)}₫
                  </p>
                </div>
              ) : (
                <p
                  id="price"
                  className="lead fw-normal mb-0 "
                  style={{ fontSize: "22px", fontWeight: "bold" }}
                >
                  {formatCurrency(item?.cartItemPrice)}₫
                </p>
              )}
            </div>

            <div className="col-md-2 d-flex justify-content-center">
              <div>
                <p className="small text-muted mb-4"></p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDetailCourse(item.courseId)}
                >
                  <i className="fas fa-info-circle"></i> Thông tin
                </button>
              </div>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              <div>
                <p className="small text-muted mb-4"></p>
                <button
                  className={`btn btn-danger ${style.btn_delete}`}
                  onClick={() => {
                    removeCartItem();
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
