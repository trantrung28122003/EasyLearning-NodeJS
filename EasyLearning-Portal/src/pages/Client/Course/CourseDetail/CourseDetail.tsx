import React, { useEffect, useState } from "react";
import ClientShared from "../../Shared/ClientShared";
import { useNavigate, useParams } from "react-router-dom";
import { CourseSlim, TrainingPart } from "../../../../model/Course";
import {
  ADD_COURSE_FREE,
  ADD_TO_CART,
  ADD_TO_FEEDBACK,
  GET_COURSE_DETAIL,
  GET_COURSE_STATUS_BY_USER,
  GET_FEEDBACKS_FOR_COURSE,
  TOGGLE_FAVORITE_COURSE,
} from "../../../../constants/API";
import {
  DoCallAPIWithOutToken,
  DoCallAPIWithToken,
} from "../../../../services/HttpService";

import "./CourseDetail.css";

import classNames from "classnames";
import { Feedback } from "../../../../model/FeedBack";
import { isUserLogin } from "../../../../hooks/useLogin";
import { HTTP_OK } from "../../../../constants/HTTPCode";
import { formatCurrency } from "../../../../hooks/useCurrency";
import CoursePreview from "../CoursePreview/CoursePreview";
import DataLoader from "../../../../components/lazyLoadComponent/DataLoader";
import { formatDateVN } from "../../../../hooks/useTime";

const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseSlim>();
  const [feedBacks, setFeedBacks] = useState<Feedback[]>([]);
  const starRatings = [1, 2, 3, 4, 5];
  const [isPurchased, setIsPurchased] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isFeedback, setIsFeedBack] = useState(false);
  const [isCourseFull, setIsCourseFull] = useState(false);
  const [isRegistrationDateExpired, setIsRegistrationDateExpired] =
    useState(false);
  const isLogin = isUserLogin();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [showModalCoursePreview, setShowModalCoursePreview] = useState(false);
  const [selectTrainingPartPreview, setSelectTrainingPartPreview] =
    useState<TrainingPart>();
  const [isLoading, setIsLoading] = useState(false);
  const [priceDiscount, setPriceDiscount] = useState<number | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [isLoadingAddCart, setIsLoadingAddCart] = useState(false);
  const [openEvents, setOpenEvents] = useState<{ [key: string]: boolean }>({});
  const fetchCourseDetail = async (courseId: string) => {
    setIsLoading(true);
    try {
      const URL = GET_COURSE_DETAIL + "/" + courseId;
      const courseRes = await DoCallAPIWithOutToken(URL, "GET");
      if (courseRes.status == HTTP_OK) {
        const courseDetail: CourseSlim = courseRes.data.result;
        setPriceDiscount(courseRes.data.result.coursePriceDiscount);
        setCourse(courseDetail);

        if (courseDetail?.courseEventResponses.length > 0) {
          const initialOpenEvents: { [key: string]: boolean } = {};
          courseDetail.courseEventResponses.forEach((classEvent, index) => {
            initialOpenEvents[classEvent.courseEventName] = index === 0;
          });
          setOpenEvents(initialOpenEvents);
        }
      }
      const feedbackURL = GET_FEEDBACKS_FOR_COURSE + "/" + courseId;
      const feedbackRes = await DoCallAPIWithOutToken(feedbackURL, "GET");
      if (feedbackRes.status === HTTP_OK) {
        setFeedBacks(feedbackRes.data.result.feedbacks);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
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
        setIsFeedBack(data.isFeedback);
        setIsCourseFull(data.isCourseFull);
        setIsRegistrationDateExpired(data.isRegistrationDateExpired);
        setIsFavorited(data.isFavorited);
        setIsFree(isFree);
      }
    } catch (error) {}
  };

  const toggleEventDetails = (eventName: string) => {
    setOpenEvents((prev) => ({
      ...prev,
      [eventName]: !prev[eventName],
    }));
  };
  const addCourseFree = async (courseId: string) => {
    setIsLoadingAddCart(true);
    try {
      const URL = ADD_COURSE_FREE + `?courseId=${courseId}`;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK && response.data.code === 200) {
        fetchCourseStatus(courseId);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi", error);
    } finally {
      setIsLoadingAddCart(false);
    }
  };
  const addToCart = () => {
    if (!isLogin) {
      localStorage.clear();
      navigate("/login");
    } else if (isFree && !isPurchased && courseId) {
      addCourseFree(courseId);
    } else if (isPurchased) {
      navigate("/userCourses");
    } else if (isInCart) {
      navigate("/shoppingCart");
    } else {
      const URL = ADD_TO_CART + `?courseId=${courseId}`;
      DoCallAPIWithToken(URL, "post").then((res) => {
        if (res.data.code === HTTP_OK) {
          if (courseId) {
            navigate("/shoppingCart");
            fetchCourseStatus(courseId);
          }
        }
      });
    }
  };
  const handleStarClick = (value: any) => {
    setRating(value);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!rating || !content.trim()) return alert("Vui lòng điền đủ thông tin!");
    try {
      const feedbackCreationRequest = {
        courseId: courseId,
        feedbackContent: content,
        feedbackRating: rating,
      };

      const URL = ADD_TO_FEEDBACK;
      const response = await DoCallAPIWithToken(
        URL,
        "POST",
        feedbackCreationRequest
      );
      if (response.status === HTTP_OK) {
        if (courseId) {
          fetchCourseDetail(courseId);
          fetchCourseStatus(courseId);
        }
        //alert("Cảm ơn bạn đã gửi phản hồi!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  const onShowModalCoursePreview = (trainingPart: TrainingPart) => {
    setShowModalCoursePreview(true);
    setSelectTrainingPartPreview(trainingPart);
  };

  const hanldeCloseModalCoursePreview = () => {
    setShowModalCoursePreview(false);
  };

  const [isFavorited, setIsFavorited] = useState(true);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const toggleFavorite = async () => {
    setIsLoadingFavorite(true);
    try {
      const URL = TOGGLE_FAVORITE_COURSE + `?courseId=${courseId}`;
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

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail(courseId);
      fetchCourseStatus(courseId);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    } else {
      console.error("Course ID is missing!");
    }
  }, [courseId]);

  return (
    <ClientShared>
      <>
        <DataLoader isLoading={isLoading} />

        <div className="container">
          <div className="product-content product-wrap clearfix product-deatil">
            <div className="row">
              <div className="col-md-5 col-sm-12 col-12">
                <div className="product-image">
                  <div id="myCarousel-2" className="carousel slide">
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <img
                          className="img-fluid"
                          alt=""
                          src={course?.courseImage}
                        />
                        <div className="favorite-icon" onClick={toggleFavorite}>
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
                      </div>
                    </div>
                  </div>
                </div>
                {course && course.learningOutcomes.length > 0 && (
                  <div className="text-section">
                    <h2>Những gì bạn sẽ học</h2>
                    <ul>
                      {course?.learningOutcomes.map((outComes, index) => (
                        <li key={index}>{outComes.outcomeName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div
                className="col-md-6 col-sm-12 col-12"
                style={{ marginLeft: "28px", flex: 1 }}
              >
                <h2 className="name">
                  {course?.courseName}

                  <small style={{ marginTop: "10px" }}>
                    {" "}
                    Khóa học bởi
                    <a style={{ color: "#06BBCC", marginLeft: "10px" }}>
                      {course?.nameInstructor}
                    </a>
                  </small>
                  <span className="fa fa-2x">
                    {starRatings.map((x) =>
                      x <= (course?.averageRating ?? 0) ? (
                        <i className="fas fa-star fa-2x text-warning" />
                      ) : (
                        <i className="fas fa-star fa-2x text-muted" />
                      )
                    )}

                    <span className="fa fa-2x">
                      {" "}
                      <h5 style={{ marginLeft: "10px" }}>
                        {" "}
                        ({course?.totalFeedback}) Lượt đánh giá
                      </h5>
                    </span>
                  </span>
                </h2>
                <hr />
                {priceDiscount ? (
                  <h3 className="price-container">
                    {formatCurrency(priceDiscount)}₫
                    <span className="price-container-discount">
                      {formatCurrency(course?.coursePrice)}₫
                    </span>
                  </h3>
                ) : (
                  <h3 className="price-container">
                    {" "}
                    {formatCurrency(course?.coursePrice)}₫
                  </h3>
                )}

                <hr />
                <div className="row">
                  <a
                    onClick={() => addToCart()}
                    className={`flex-shrink-0 btn btn-sm btn-primary px-3 ${
                      isCourseFull || isRegistrationDateExpired
                        ? "disabled"
                        : ""
                    }`}
                    style={{
                      borderRadius: "30px",
                      fontSize: "18px",
                    }}
                    // disabled={isCourseFull || isRegistrationDateExpired}
                  >
                    {isLoadingAddCart ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        {isPurchased
                          ? "Bắt Đầu Học Ngay"
                          : isInCart
                          ? "Đi Tới Giỏ Hàng"
                          : isCourseFull && isRegistrationDateExpired
                          ? "Ngày đăng ký khóa học đã hết hạn và đã đủ số lượng đăng kí"
                          : isCourseFull
                          ? "Khóa học đã đủ số lượng đăng kí"
                          : isRegistrationDateExpired
                          ? "Ngày đăng ký khóa học đã hết hạn"
                          : "Tham Gia Ngay"}
                      </>
                    )}
                  </a>
                </div>

                {(isCourseFull || isRegistrationDateExpired) && (
                  <h5 className=" mt-2 text-center">
                    Bạn có thể đăng kí khóa học vào lúc{" "}
                    <strong>
                      {course && formatDateVN(course?.nextAvailableDate)}
                    </strong>{" "}
                  </h5>
                )}

                <hr />
                <div className="description description-tabs">
                  <ul className="nav nav-pills">
                    <li className="nav-item">
                      <a
                        href="#specifications"
                        data-bs-toggle="tab"
                        className="nav-link active no-margin"
                      >
                        Nội dung khóa học
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#more-information"
                        data-bs-toggle="tab"
                        className="nav-link "
                      >
                        Chi tiết khóa học
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        href="#reviews"
                        data-bs-toggle="tab"
                        className="nav-link"
                      >
                        Đánh giá
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="specifications"
                    >
                      <br />
                      <dl>
                        {course?.courseEventResponses.map((classEvent) => (
                          <>
                            <br />
                            <dt
                              className="toggle-details"
                              onClick={() =>
                                toggleEventDetails(classEvent.courseEventName)
                              }
                            >
                              {classEvent.courseEventName} &nbsp;
                              <span className="icon">
                                <i
                                  className={`fas ${
                                    openEvents[classEvent.courseEventName]
                                      ? "fa-chevron-up"
                                      : "fa-chevron-down"
                                  }`}
                                ></i>
                              </span>
                            </dt>
                            {openEvents[classEvent.courseEventName] && (
                              <div className="details">
                                {classEvent.trainingParts.map((part) => (
                                  <>
                                    <dd
                                      className={classNames("training-part", {
                                        free: part.free,
                                        "not-free": !part.free,
                                      })}
                                      onClick={() =>
                                        part.free &&
                                        onShowModalCoursePreview(part)
                                      }
                                    >
                                      <span>
                                        {part.trainingPartType == "LESSON" ? (
                                          <i className="fas fa-tv"></i>
                                        ) : (
                                          <i className="far fa-file-alt"></i>
                                        )}
                                        <span
                                          className={classNames({
                                            underline: part.free,
                                          })}
                                        >
                                          {part.trainingPartName}
                                        </span>
                                      </span>
                                      {part.free && (
                                        <span className="preview-text">
                                          Xem thử
                                        </span>
                                      )}
                                    </dd>
                                  </>
                                ))}
                              </div>
                            )}
                          </>
                        ))}
                        <br />
                      </dl>
                    </div>

                    <div className="tab-pane fade " id="more-information">
                      <br />
                      <p>{course?.courseName}</p>
                    </div>

                    <div className="tab-pane fade" id="reviews">
                      <br />
                      {isPurchased && !isFeedback && (
                        <div className="well padding-bottom-10">
                          <form onSubmit={handleSubmit} className="form-group">
                            <div className="form-group">
                              <textarea
                                id="textContent"
                                name="content"
                                rows={4}
                                className="form-control"
                                placeholder="Write a review"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                              ></textarea>
                            </div>
                            <div
                              className="d-flex justify-content-end"
                              style={{ marginTop: "4px" }}
                            >
                              {[1, 2, 3, 4, 5].map((value) => (
                                <span
                                  key={value}
                                  className={`fas fa-star ${
                                    value <= rating
                                      ? "text-warning"
                                      : "text-muted"
                                  }`}
                                  style={{
                                    fontSize: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleStarClick(value)}
                                ></span>
                              ))}
                            </div>
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary pull-right"
                              style={{ fontSize: "16px" }}
                            >
                              Đánh giá khóa học
                            </button>
                          </form>
                        </div>
                      )}
                      <div className="chat-body no-padding profile-message">
                        <ul>
                          {feedBacks.map((itemFeedback, index) => (
                            <li
                              className="message row"
                              key={index}
                              style={{
                                borderBottom: "1px solid #ddd",
                                marginBottom: "10px",
                                marginTop: "28px",
                              }}
                            >
                              <div className="col-md-1">
                                <img
                                  src={itemFeedback.avatar}
                                  className="online"
                                />
                              </div>
                              <div className="col-md-11">
                                <span className="message-text">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <a className="username">
                                      <span
                                        style={{ justifyContent: "flex-start" }}
                                      >
                                        <span className="feedback-userName-background">
                                          {" "}
                                          {itemFeedback.fullNameUser}
                                        </span>

                                        <span style={{ fontSize: "14px" }}>
                                          {" "}
                                          - {itemFeedback.typeUser}{" "}
                                        </span>
                                      </span>
                                    </a>

                                    <span
                                      className="rating-and-report"
                                      style={{
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        marginLeft: "auto",
                                      }}
                                    >
                                      <span className="star-rating">
                                        {starRatings.map((i) => (
                                          <i
                                            key={i}
                                            className={`fas fa-star fa-2x ${
                                              i <= itemFeedback.feedbackRating
                                                ? "text-warning"
                                                : "text-muted"
                                            }`}
                                          />
                                        ))}
                                      </span>
                                      <i
                                        className="fas fa-ellipsis-h report-icon"
                                        style={{
                                          float: "right",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => alert("Report feedback")}
                                        title="Report this feedback"
                                      />
                                    </span>
                                  </div>

                                  <small
                                    className="text-muted pull-right ultra-light"
                                    style={{ fontSize: "16px" }}
                                  >
                                    {" "}
                                    {itemFeedback.content}
                                  </small>
                                </span>
                                <ul className="list-inline font-xs">
                                  <li className="pull-right"></li>
                                </ul>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showModalCoursePreview && course && selectTrainingPartPreview && (
          <CoursePreview
            course={course}
            trainingPart={selectTrainingPartPreview}
            onClose={hanldeCloseModalCoursePreview}
          />
        )}
      </>
    </ClientShared>
  );
};

export default CourseDetail;
