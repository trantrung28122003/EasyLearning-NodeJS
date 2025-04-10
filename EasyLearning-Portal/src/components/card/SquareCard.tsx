import React, { useEffect, useState } from "react";
import { Course } from "../../model/Course";
import {
  DoCallAPIWithOutToken,
  DoCallAPIWithToken,
} from "../../services/HttpService";
import {
  ADD_TO_CART,
  GET_COURSE_DETAIL,
  GET_COURSE_STATUS_BY_USER,
  TOGGLE_FAVORITE_COURSE,
} from "../../constants/API";
import { HTTP_OK } from "../../constants/HTTPCode";
import { useNavigate } from "react-router-dom";
import { isUserLogin } from "../../hooks/useLogin";
import { formatCurrency } from "../../hooks/useCurrency";
import "./SquareCard.css";
import CartOverlay from "./CartOverlay";

interface CardProps {
  course: Course;
}

const SquareCard: React.FC<CardProps> = ({ course }) => {
  const navigate = useNavigate();
  const starRatings = [1, 2, 3, 4, 5];
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [priceDiscount, setPriceDiscount] = useState<number | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isLogin = isUserLogin();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [addShopingCartItem, setAddShoppingCartItem] =
    useState<ShoppingCartItem>();
  const [isFavorited, setIsFavorited] = useState(true);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const fetchCourseDetail = async (courseId: string) => {
    try {
      const URL = GET_COURSE_DETAIL + "/" + courseId;
      const response = await DoCallAPIWithOutToken(URL, "GET");
      if (response.status === HTTP_OK) {
        const data = await response.data.result;
        setAverageRating(data.averageRating);
        setPriceDiscount(data.coursePriceDiscount);
      }
    } catch (error) {
      console.error("Error fetching course detail:", error);
    }
  };

  const fetchCourseStatus = async (courseId: string) => {
    try {
      const URL = GET_COURSE_STATUS_BY_USER + `?courseId=${courseId}`;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        const data = await response.data.result;
        setIsInCart(data.isInCart);
        setIsPurchased(data.isPurchased);
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error("Error fetching course status:", error);
    }
  };
  const hanldeCloseCardOverLay = () => {
    setIsOverlayOpen(false);
    document.body.classList.remove("overflow-hidden");
  };
  useEffect(() => {
    if (course?.id) {
      fetchCourseDetail(course.id);
      fetchCourseStatus(course.id);
    }
  }, [course.id]);

  const addToCart = () => {
    if (!isLogin) {
      localStorage.clear();
      navigate("/login");
    } else if (isPurchased) {
      navigate("/userCourses");
    } else if (isInCart) {
      navigate("/shoppingCart");
    } else {
      const URL = ADD_TO_CART + `?courseId=${course.id}`;
      DoCallAPIWithToken(URL, "post").then((res) => {
        if (res.data.code === HTTP_OK) {
          setIsOverlayOpen(true);
          setAddShoppingCartItem(res.data.result);
          fetchCourseStatus(course.id);
        } else if (res.data.code === 400) {
          setErrorMessage(
            "Khóa học đã hết hạn đăng kí và số lượng đăng kí đã đầy"
          );
        } else if (res.data.code === 401) {
          setErrorMessage("Khóa học đã hết hạn đăng kí ");
        } else if (res.data.code === 402) {
          setErrorMessage("Số lượng đăng kí khóa học đã đầy");
        }
      });
    }
  };

  const handleNavigateToCourseDetail = (courseId: string) => {
    const courseDetailUrl = "/course/" + courseId;
    window.open(courseDetailUrl, "_blank");
  };

  const toggleFavorite = async () => {
    setIsLoadingFavorite(true);
    try {
      const URL = TOGGLE_FAVORITE_COURSE + `?courseId=${course.id}`;
      const response = await DoCallAPIWithToken(URL, "POST");
      if (response.status === HTTP_OK) {
        setIsFavorited(response.data.result);
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <>
      <div
        className="col-lg-3 col-md-6 col-sm-12 wow fadeInUp"
        data-wow-delay="0.3s"
      >
        <div className="course-item bg-light h-100 d-flex flex-column">
          <div className="position-relative overflow-hidden">
            <div className="favorite-icon" onClick={toggleFavorite}>
              {isLoadingFavorite ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i
                  className={`${isFavorited ? "fas fa-heart" : "far fa-heart"}`}
                ></i>
              )}
            </div>
            <img
              className="img-fluid"
              src={course.imageUrl}
              alt=""
              onClick={() => handleNavigateToCourseDetail(course.id)}
            />
            <div className="w-100 d-flex justify-content-center position-absolute bottom-0 start-0 mb-4">
              <a
                href={"/course/" + course.id}
                className="flex-shrink-0 btn btn-sm btn-primary px-3 border-end"
                style={{ borderRadius: "30px 0 0 30px" }}
              >
                Xem Thêm
              </a>
              <a
                onClick={addToCart}
                className="flex-shrink-0 btn btn-sm btn-primary px-3"
                style={{ borderRadius: "0 30px 30px 0" }}
              >
                {isPurchased
                  ? "Bắt Đầu Học Ngay"
                  : isInCart
                  ? "Đi Tới Giỏ Hàng"
                  : "Tham Gia Ngay"}
              </a>
            </div>
          </div>
          <div
            className="text-center p-2 pb-0"
            onClick={() => handleNavigateToCourseDetail(course.id)}
          >
            {priceDiscount && priceDiscount > 0 ? (
              <>
                <h5
                  className="mb-0"
                  style={{
                    fontSize: "14px",
                    color: "#888",
                    textDecoration: "line-through",
                  }}
                >
                  {formatCurrency(course.coursePrice)}₫
                </h5>
                <h5 className="mb-0">{formatCurrency(priceDiscount)}₫</h5>
              </>
            ) : (
              <>
                <h5
                  className="mb-0"
                  style={{
                    fontSize: "14px",
                    color: "#888",
                  }}
                >
                  Chưa có khuyến mãi
                </h5>
                <h5 className="mb-0">{formatCurrency(course.coursePrice)}₫</h5>
              </>
            )}
            <div className="mb-2" style={{ fontSize: "14px" }}>
              {starRatings.map((i) =>
                i <= (averageRating ?? 0) ? (
                  <small key={i} className="fa fa-star text-warning"></small>
                ) : (
                  <small key={i} className="fa fa-star text-muted"></small>
                )
              )}
              <small style={{ marginLeft: "4px" }}>
                ({course.feedbacks.length})
              </small>
            </div>
            <h5 className="mb-2 course-name">{course.courseName}</h5>
          </div>
          <div className="d-flex border-top">
            <small className="flex-fill text-center border-end py-2">
              <i
                className={`fa ${
                  course.courseType === "ONLINE" ? "fa-globe" : "fa-building"
                } text-primary me-2`}
              ></i>
              {course.courseType === "ONLINE" ? "Trực tuyến" : "Trực tiếp"}
            </small>
            <small className="flex-fill text-center border-end py-2">
              <i className="fa fa-clock text-primary me-2"></i>
              {course.trainingParts.length}
            </small>
            <small className="flex-fill text-center py-2">
              <i className="fa fa-user text-primary me-2"></i>
              {course.registeredUsers}
            </small>
          </div>
          {errorMessage && (
            <div
              className="modal-overlay"
              onClick={() => setErrorMessage(null)}
            >
              <div className="modal-container">
                <h4 className="text-custom">
                  {" "}
                  <i className="fas fa-bell"></i> eLEARNING thông báo cho bạn!
                </h4>
                <button
                  className="modal-close-btn"
                  onClick={() => setErrorMessage(null)}
                >
                  Đóng
                </button>
                <div className="modal-list text-center">
                  <h5>{errorMessage}</h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {addShopingCartItem && (
        <CartOverlay
          isOpen={isOverlayOpen}
          onClose={hanldeCloseCardOverLay}
          shopingCartItemNew={addShopingCartItem}
        />
      )}
    </>
  );
};

export default SquareCard;
