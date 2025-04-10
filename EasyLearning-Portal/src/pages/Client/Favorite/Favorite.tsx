import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_ALL_FAVORITE_COURSE_BY_COURSE } from "../../../constants/API";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { ApplicationResponse } from "../../../model/BaseResponse";
import { Course} from "../../../model/Course";
import ClientShared from "../Shared/ClientShared";
import DataLoader from "../../../components/lazyLoadComponent/DataLoader";
import SquareCard from "../../../components/card/SquareCard";


const Favorite: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  const doCallGetCourseByUser = () => {
    setIsLoading(true);
    DoCallAPIWithToken(GET_ALL_FAVORITE_COURSE_BY_COURSE, "get")
      .then((res) => {
        const response: ApplicationResponse<Course[]> = res.data;
        console.log(response.result);
        setCourses(response.result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    doCallGetCourseByUser();
  }, []);

  return (
    <ClientShared>
      <div className="page-content-user-course">
        <DataLoader isLoading={isLoading} />
        {!isLoading && courses.length === 0 ? (
          <div className="col-lg-12 text-header">
            <div className="centered-content">
              <img
                src="https://easylearning.blob.core.windows.net/images-videos/icon-notification.png"
                style={{ width: "380px" }}
                alt="No data"
              />
              <h2 className="warning-message">
                Bạn chưa có bất kì khóa học yêu thích nào cả!
              </h2>
              <h1>Hãy yêu thích khóa học nếu bạn cảm thấy hứng thú</h1>
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
            style={{ marginBottom: "30px" }}
          >
            <div className="section-title text-center">
              <div className="title-text">
                <h2
                  className="h2-text-center"
                  style={{ marginTop: "28px", color: "#06BBCC" }}
                >
                  ------------------------------ Các khóa học yêu thích của bạn
                  ------------------------------
                </h2>
              </div>
            </div>
          </div>
        )}
         <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-4 justify-content-center">
              {courses.map((course, index: number) => {
                return <SquareCard course={course} key={index} />;
              })}
            </div>
          </div>
        </div> 
      </div>
    </ClientShared>
  );
};

export default Favorite;
