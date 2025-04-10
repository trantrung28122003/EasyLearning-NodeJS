import React, { useEffect, useState } from "react";
import "./CartOverlay.css";
import DataLoader from "../lazyLoadComponent/DataLoader";
import { formatCurrency } from "../../hooks/useCurrency";
import { useNavigate } from "react-router-dom";
import { DoCallAPIWithToken } from "../../services/HttpService";
import { BASE_URL_SHOPPING_CART } from "../../constants/API";
import { HTTP_OK } from "../../constants/HTTPCode";

interface CartOverlayProps {
  shopingCartItemNew: ShoppingCartItem;
  isOpen: boolean;
  onClose: () => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({
  shopingCartItemNew,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const doGetShoppingCart = () => {
    setIsLoading(true);
    DoCallAPIWithToken(BASE_URL_SHOPPING_CART, "get")
      .then((res) => {
        if (res.status === HTTP_OK) {
          const shoppingCart: ShoppingCart = res.data;
          setShoppingCart(shoppingCart);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      doGetShoppingCart();
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <DataLoader isLoading={isLoading} />
      <div className="cart-overlay">
        <div className="cart-overlay-outside-click" onClick={onClose}></div>
        <div className="cart-overlay-content">
          <button className="cart-overlay-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <h2 className="cart-overlay-header">Thêm thành công vào giỏ hàng</h2>
          <hr />
          <div className="cart-overlay-course-card">
            <div className="cart-overlay-tick">
              <i className="fas fa-check-circle"></i>
            </div>
            <img src={shopingCartItemNew.imageUrl} alt="course" />
            <div>
              <h3>{shopingCartItemNew.cartItemName}</h3>
              <p>
                {formatCurrency(shopingCartItemNew.cartItemPrice)}₫
                {shopingCartItemNew.cartItemPriceDiscount !==
                  shopingCartItemNew.cartItemPrice && (
                  <del>
                    {formatCurrency(shopingCartItemNew.cartItemPriceDiscount)}₫
                  </del>
                )}
              </p>
            </div>
          </div>
          {shoppingCart && (
            <>
              <h3 className="cart-overlay-subheader">
                Danh sách các khóa học trong giỏ hàng của bạn
              </h3>
              <div className="cart-overlay-shoppingCarts">
                {shoppingCart.shoppingCartItemResponses.map((item, index) => (
                  <div key={index} className="cart-overlay-shoppingCart-card">
                    <img src={item.imageUrl} />
                    <div>
                      <h4 className="course-name">{item.cartItemName}</h4>
                      <p>
                        {formatCurrency(item.cartItemPrice)}₫
                        {item.cartItemPriceDiscount != item.cartItemPrice && (
                          <del>
                            {formatCurrency(item.cartItemPriceDiscount)}₫
                          </del>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <hr />
          <div className="cart-overlay-total">
            <h3>
              Tổng: <span>{formatCurrency(shoppingCart?.totalPrice)}₫</span>{" "}
              {shoppingCart?.totalPrice != shoppingCart?.totalPriceDiscount && (
                <del>{formatCurrency(shoppingCart?.totalPriceDiscount)}₫</del>
              )}
            </h3>
            <button
              className="cart-overlay-add-btn"
              onClick={() => navigate("/shoppingCart")}
            >
              Đi tới giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartOverlay;
