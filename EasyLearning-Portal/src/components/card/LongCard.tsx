import { useNavigate } from "react-router-dom";
import { Course } from "../../model/Course";
import { useEffect, useState } from "react";
import {
  ADD_TO_CART,
  GET_COURSE_DETAIL,
  GET_COURSE_STATUS_BY_USER,
  TOGGLE_FAVORITE_COURSE,
  ADD_COURSE_FREE,
} from "../../constants/API";
import {
  DoCallAPIWithOutToken,
  DoCallAPIWithToken,
} from "../../services/HttpService";
import { HTTP_OK } from "../../constants/HTTPCode";
import { formatCurrency } from "../../hooks/useCurrency";
import { isUserLogin } from "../../hooks/useLogin";
import CartOverlay from "./CartOverlay";

interface CardProps {
  course: Course;
}

const LongCard: React.FC<CardProps> = ({ course }) => {
  const navigate = useNavigate();
  const isLogin = isUserLogin();
  const starRatings = [1, 2, 3, 4, 5];
  const [isPurchased, setIsPurchased] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalLearningTime, setTotalLearningTime] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [priceDiscount, setPriceDiscount] = useState<number | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [addShopingCartItem, setAddShoppingCartItem] =
    useState<ShoppingCartItem>();

  const [isFavorited, setIsFavorited] = useState(true);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingAddCart, setIsLoadingAddCart] = useState(false);
  const fetchCourseDetail = async (courseId: string) => {
    try {
      const URL = GET_COURSE_DETAIL + "/" + courseId;
      const response = await DoCallAPIWithOutToken(URL, "GET");
      if (response.status === HTTP_OK) {
        const data = await response.data.result;
        setAverageRating(data.averageRating);
        setTotalLearningTime(data.totalLearningTime);
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
        setIsFree(data.isFree);
      }
    } catch (error) {}
  };

  const addCourseFree = async (courseId: string) => {
    setIsLoadingAddCart(true);
    try {
      const URL = ADD_COURSE_FREE + `?courseId=${courseId}`;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK && response.data.code === 200) {
        fetchCourseStatus(course.id);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi", error);
    } finally {
      setIsLoadingAddCart(false);
    }
  };

  const addToCart = (courseId: string) => {
    if (!isLogin) {
      localStorage.clear();
      navigate("/login");
    } else if (isFree && !isPurchased) {
      addCourseFree(courseId);
    } else if (isPurchased) {
      navigate("/userCourses");
    } else if (isInCart) {
      navigate("/shoppingCart");
    } else {
      setIsLoadingAddCart(true);
      const URL = ADD_TO_CART + `?courseId=${courseId}`;
      DoCallAPIWithToken(URL, "post")
        .then((res) => {
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
        })
        .finally(() => setIsLoadingAddCart(false));
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

  return (
    <>
      {addShopingCartItem && (
        <CartOverlay
          isOpen={isOverlayOpen}
          onClose={hanldeCloseCardOverLay}
          shopingCartItemNew={addShopingCartItem}
        />
      )}

      <div
        className="course-card"
        onClick={() => handleNavigateToCourseDetail(course.id)}
      >
        <div
          key={course.id}
          className="mb-3 p-3 border rounded d-flex align-items-center justify-content-between"
        >
          <div
            className="product-image me-3 d-flex justify-content-center align-items-center"
            style={{ width: "180px" }}
          >
            <img
              src={course.imageUrl}
              alt="Product"
              style={{
                width: "180px",
                height: "100px",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="flex-grow-1">
            <h5 className="text-truncate">{course.courseName}</h5>
            <p className="text-muted mb-1">{course.instructor}</p>
            <p className="mb-1" style={{ fontSize: "15px" }}>
              {starRatings.map((i) =>
                i <= (averageRating ?? 0) ? (
                  <small className="fa fa-star text-warning "></small>
                ) : (
                  <small className="fa fa-star text-mute"> </small>
                )
              )}{" "}
              ({course.feedbacks.length})
            </p>
            <p className="mb-1 text-truncate" style={{ fontSize: "14px" }}>
              <i
                className={`fa ${
                  course.courseType === "ONLINE" ? "fa-globe" : "fa-building"
                } text-primary me-2`}
              ></i>
              {course.courseType === "ONLINE" ? "Trực tuyến" : "Trực tiếp"} -
              {course.trainingParts.length} bài giảng - cấp độ TẤT CẢ
            </p>
          </div>

          <div className="text-end" style={{ minWidth: "150px" }}>
            {priceDiscount ? (
              <>
                <p className="text-danger fs-5 mb-0">
                  {formatCurrency(priceDiscount)}₫
                </p>
                <p className="text-muted text-decoration-line-through mb-0">
                  {formatCurrency(course.coursePrice)}₫
                </p>
              </>
            ) : isFree ? (
              <p className="text-danger fs-5 mb-0">Miễn Phí</p>
            ) : (
              <p className="text-danger fs-5 mb-0">
                {formatCurrency(course.coursePrice)}₫
              </p>
            )}
          </div>
        </div>

        <div className="hover-card" onClick={(e) => e.stopPropagation()}>
          <h4>Tổng quan</h4>
          <ul>
            <li>{course.courseDescription}</li>
          </ul>
          <div className="d-flex justify-content-center">
            <button
              onClick={() => addToCart(course.id)}
              className="add-to-cart"
            >
              {isLoadingAddCart ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  {isPurchased
                    ? "Bắt Đầu Học Ngay"
                    : isInCart
                    ? "Đi Tới Giỏ Hàng  "
                    : "Tham Gia Ngay"}
                </>
              )}
            </button>

            <span className="favorite" onClick={() => toggleFavorite()}>
              <div className="heart-circle">
                {isLoadingFavorite ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i
                    className={`${
                      isFavorited ? "fas fa-heart" : "far fa-heart"
                    }`}
                  ></i>
                )}
              </div>
            </span>
          </div>
          <div className="hover-card-arrow"></div>
        </div>
      </div>
      {errorMessage && (
        <div className="modal-overlay" onClick={() => setErrorMessage(null)}>
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
    </>
  );
};

export default LongCard;
