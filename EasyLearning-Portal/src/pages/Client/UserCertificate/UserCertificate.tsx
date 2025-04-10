import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientShared from "../Shared/ClientShared";
import { CertificateResponse } from "../../../model/Certificate";
import {
  GET_ALL_CERTIFICATE_BY_USER,
  GET_COURSE_BY_USER,
} from "../../../constants/API";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { HTTP_OK } from "../../../constants/HTTPCode";
import Certificate from "../../../components/certificate/Certificate";
import { CourseSlim } from "../../../model/Course";
import { ApplicationResponse } from "../../../model/BaseResponse";
import DataLoader from "../../../components/lazyLoadComponent/DataLoader";

const UserCertificate: React.FC = () => {
  const [userCertificates, setUserCertificates] = useState<
    CertificateResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCourse, setUserCourse] = useState<CourseSlim[]>([]);
  const navigate = useNavigate();
  const doCallGetCourseByUser = () => {
    DoCallAPIWithToken(GET_COURSE_BY_USER, "get").then((res) => {
      const response: ApplicationResponse<CourseSlim[]> = res.data;
      console.log(response.result);
      setUserCourse(response.result);
    });
  };

  const doCallGetCertificateByUser = async () => {
    setIsLoading(true);
    try {
      const URL = GET_ALL_CERTIFICATE_BY_USER;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        const data = response.data.result;
        setUserCertificates(data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    doCallGetCertificateByUser();
    doCallGetCourseByUser();
  }, []);
  return (
    <ClientShared>
      <DataLoader isLoading={isLoading} />
      <div className="page-content-user-course">
        {userCourse.length === 0 && isLoading ? (
          <div className="col-lg-12 text-header">
            <div className="centered-content">
              <img
                src="https://easylearning.blob.core.windows.net/images-videos/icon-notification.png"
                style={{ width: "380px" }}
                alt="No data"
              />
              <h2 className="warning-message">
                Bạn chưa đăng ký bất kì khóa học nào nên chưa có chứng chỉ!
              </h2>
              <h1>Vui lòng chọn khóa học bạn muốn để đăng ký.</h1>
              <p>
                Theo dõi website thường xuyên để cập nhật thông tin khóa học mới
                nhất, giúp bạn không bỏ lỡ bất kỳ cơ hội học nào!
              </p>
              <button
                className="explore-course-btn"
                onClick={() => navigate("/courses")}
              >
                Khám phá các khóa học
              </button>
            </div>
          </div>
        ) : userCertificates.length === 0 && userCourse.length > 0 ? (
          <div className="col-lg-12 text-header">
            <div className="centered-content">
              <img
                src="https://easylearning.blob.core.windows.net/images-videos/icon-notification.png"
                style={{ width: "380px" }}
                alt="No data"
              />
              <h2 className="warning-message">Bạn chưa có chứng chỉ nào cả!</h2>
              <h1>
                Vui lòng hoàn thành những khóa học của bạn đẻ có chứng chỉ.
              </h1>
              <p>
                Theo dõi website thường xuyên để cập nhật thông tin khóa học mới
                nhất, giúp bạn không bỏ lỡ bất kỳ cơ hội học nào!
              </p>
              <button
                className="explore-course-btn"
                onClick={() => navigate("/userCourses")}
              >
                Khám phá các khóa học
              </button>
            </div>
          </div>
        ) : (
          <div
            className="col-lg-12 text-header"
            style={{ paddingBottom: "80px" }}
          >
            <div className="section-title text-center">
              <div className="title-text">
                <h2
                  className="h2-text-center"
                  style={{ marginTop: "28px", color: "#06BBCC" }}
                >
                  ------------------------------- Các Chứng chỉ của bạn
                  -------------------------------
                </h2>
              </div>
            </div>
            {userCertificates.map((certificate, index) => (
              <Certificate certificate={certificate} key={index} />
            ))}
          </div>
        )}
        <div className="container"></div>
      </div>
    </ClientShared>
  );
};

export default UserCertificate;
