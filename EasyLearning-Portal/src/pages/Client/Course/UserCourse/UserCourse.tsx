import React, { useEffect, useState } from "react";
import { GET_COURSE_BY_USER } from "../../../../constants/API";
import { ApplicationResponse } from "../../../../model/BaseResponse";
import { CourseSlim } from "../../../../model/Course";
import { DoCallAPIWithToken } from "../../../../services/HttpService";
import ClientShared from "../../Shared/ClientShared";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DataLoader from "../../../../components/lazyLoadComponent/DataLoader";
import "./UserCourse.css";

const UserCourse: React.FC = () => {
  const [userCourse, setUserCourse] = useState<CourseSlim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const doCallGetCourseByUser = () => {
    setIsLoading(true);
    DoCallAPIWithToken(GET_COURSE_BY_USER, "get")
      .then((res) => {
        const response: ApplicationResponse<CourseSlim[]> = res.data;
        console.log(response.result);
        setUserCourse(response.result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const calculateProgressPercentage = (
    completedLessons: number,
    totalLessons: number
  ) => {
    return Math.round((completedLessons / totalLessons) * 100);
  };

  function handleNavigationLearning(itemCourse: CourseSlim) {
    if (itemCourse.courseType === "ONLINE") {
      const learningUrl = "/learning/" + itemCourse.courseId;
      window.open(learningUrl, "_blank");
    } else {
      navigate("/schedule");
    }
  }
  useEffect(() => {
    doCallGetCourseByUser();
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  return (
    <ClientShared>
      <div className="page-content-user-course">
        <DataLoader isLoading={isLoading} />
        {!isLoading && userCourse.length === 0 ? (
          <div className="col-lg-12 text-header">
            <div className="centered-content">
              <img
                src="https://easylearning.blob.core.windows.net/images-videos/icon-notification.png"
                style={{ width: "380px" }}
                alt="No data"
              />
              <h2 className="warning-message">
                Bạn chưa đăng ký bất kì khóa học nào!
              </h2>
              <h1>Vui lòng chọn khóa học bạn muốn để đăng ký.</h1>
              <p>
                Theo dõi website thường xuyên để cập nhật thông tin khóa học mới
                nhất, giúp bạn không bỏ lỡ bất kỳ cơ hội học nào!
              </p>
              <button
                className="explore-course-btn"
                onClick={() => navigate("/courses/search")}
              >
                Khám phá các khóa học
              </button>
            </div>
          </div>
        ) : (
          <div
            className="col-lg-12 text-header"
            style={{ marginBottom: "80px" }}
          >
            <div className="section-title text-center">
              <div className="title-text">
                <h2
                  className="h2-text-center"
                  style={{ marginTop: "28px", color: "#06BBCC" }}
                >
                  ------------------------------- Các khóa học của bạn
                  -------------------------------
                </h2>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <div className="row accordion" id="accordion">
            <div className="col-xl-12">
              <div className="row">
                <div className="col-lg-12">
                  {userCourse?.map((itemCourse) => (
                    <div
                      key={itemCourse.courseId}
                      className="card product_list accordion-item"
                    >
                      <div className="card-header accordion-header">
                        <div
                          className="btn btn-link accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target={`#item_${itemCourse.courseId}`}
                          aria-expanded="false"
                        >
                          <a
                            onClick={() => handleNavigationLearning(itemCourse)}
                          >
                            <div className="list_block">
                              <div className="list_image">
                                <a className="nav-item nav-link active">
                                  <div className="image-container">
                                    <img
                                      src={itemCourse.courseImage}
                                      className="image-fit-contain"
                                      alt="img"
                                    />
                                    <div className="play-button-overlay">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="white"
                                        className="play-icon"
                                      >
                                        <circle
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          fill="rgba(0, 0, 0, 0.6)"
                                        />
                                        <polygon
                                          points="10,8 16,12 10,16"
                                          fill="white"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <span>
                                    {itemCourse.courseType === "ONLINE" ? (
                                      <>
                                        <i
                                          className="fas fa-globe"
                                          style={{
                                            marginLeft: "6px",
                                            marginRight: "4px",
                                          }}
                                        ></i>
                                        Trực tuyến
                                      </>
                                    ) : (
                                      <>
                                        <i
                                          className="fas fa-chalkboard-teacher"
                                          style={{ marginRight: "11px" }}
                                        ></i>
                                        Trực tiếp
                                      </>
                                    )}
                                  </span>
                                </a>
                              </div>
                              <div className="list_text">
                                <a className="nav-item nav-link active">
                                  <p
                                    className="subtitle"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {itemCourse.courseName}
                                  </p>
                                  {itemCourse.courseType === "ONLINE" ? (
                                    <div className="container-circular-progress">
                                      <div style={{ display: "flex" }}>
                                        <div
                                          className="circular-progress"
                                          style={{
                                            backgroundImage: `conic-gradient(
                                          #38c9d6 ${
                                            calculateProgressPercentage(
                                              itemCourse.completedPartsByCourse,
                                              itemCourse.totalTrainingPartByCourse
                                            ) || 0
                                          }%,
                                          #808080 ${
                                            calculateProgressPercentage(
                                              itemCourse.completedPartsByCourse,
                                              itemCourse.totalTrainingPartByCourse
                                            ) || 0
                                          }%
                                        )`,
                                          }}
                                        >
                                          <span className="progress-value">
                                            {calculateProgressPercentage(
                                              itemCourse.completedPartsByCourse,
                                              itemCourse.totalTrainingPartByCourse
                                            ) || 0}
                                            %
                                          </span>
                                        </div>
                                        <div
                                          className="complete-course"
                                          style={{ marginTop: "20px" }}
                                        >
                                          <h6
                                            className="title"
                                            style={{ marginLeft: "20px" }}
                                          >
                                            <strong>
                                              {
                                                itemCourse.completedPartsByCourse
                                              }{" "}
                                              /{" "}
                                              {
                                                itemCourse.totalTrainingPartByCourse
                                              }
                                            </strong>{" "}
                                            bài học
                                          </h6>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <h6
                                        style={{
                                          opacity: 0.6,
                                        }}
                                      >
                                        Bắt đầu từ ngày {""}
                                        {dayjs(itemCourse.startDate).format(
                                          "DD/MM/YYYY"
                                        )}{" "}
                                        đến{" "}
                                        {dayjs(itemCourse.endDate).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </h6>
                                      <h6>
                                        Có tổng cộng{" "}
                                        {itemCourse.courseEventResponses.length}{" "}
                                        buổi học
                                      </h6>
                                    </>
                                  )}
                                </a>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>

                      <div
                        id={`item_${itemCourse.courseId}`}
                        className="accordion-collapse collapse"
                      >
                        <div className="card-body accordion-body">
                          <div className="row">
                            {itemCourse.courseEventResponses.map(
                              (itemCourseEvent) => (
                                <div
                                  key={itemCourseEvent.id}
                                  className="col-sm-4 col-6"
                                >
                                  <a className="nav-item nav-link active">
                                    <div
                                      className="list_block_item"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <p
                                        className="category"
                                        style={{ fontSize: "16px" }}
                                      >
                                        {itemCourseEvent.courseEventName}
                                      </p>
                                      {itemCourse.courseType === "ONLINE" ? (
                                        <h6 className="title">
                                          <strong>
                                            {
                                              itemCourseEvent.completedPartsByCourseEvent
                                            }{" "}
                                            /{" "}
                                            {
                                              itemCourseEvent.totalPartsByCourseEvent
                                            }
                                          </strong>{" "}
                                          bài học
                                        </h6>
                                      ) : (
                                        <div></div>
                                      )}
                                    </div>
                                  </a>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientShared>
  );
};

export default UserCourse;
