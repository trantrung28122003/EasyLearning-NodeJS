import React, { useEffect, useRef, useState } from "react";
import ClientShared from "../Shared/ClientShared";
import { useLocation, useNavigate } from "react-router-dom";
import { GET_CERTIFICATE_BY_COURSE } from "../../../constants/API";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { HTTP_OK } from "../../../constants/HTTPCode";
import { CertificateResponse } from "../../../model/Certificate";
import { saveAs } from "file-saver";
import "./UserCertificate.css";

const ConfirmCertificate: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { courseId } = location.state || {};
  const [certificateByCourse, setCertificateByCourse] =
    useState<CertificateResponse>();
  const [isChecked, setIsChecked] = useState(false); 
  const isInitialRender = useRef(true);

  const imageUrl = certificateByCourse?.certificateUrl.replace(
    "/upload/",
    "/upload/f_jpg/"
  );

  const fetchCertificate = async () => {
    try {
      const URL = GET_CERTIFICATE_BY_COURSE + `?courseId=${courseId}`;
      const response = await DoCallAPIWithToken(URL, "GET");
      if (response.status === HTTP_OK) {
        setCertificateByCourse(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // Đánh dấu render đầu tiên đã xong
      return;
    }
    if (courseId) {
      fetchCertificate();
    }
  }, [courseId]);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  const handleConfirm = async () => {
    if (certificateByCourse?.certificateUrl) {
      try {
        const response = await fetch(certificateByCourse.certificateUrl);
        const blob = await response.blob();
        saveAs(blob, `${certificateByCourse.userFullName}.pdf`);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    }
    navigate("/certificate", { replace: true });
  };

  return (
    <ClientShared>
      <div style={{ height: "100vh", marginTop: "15px" }}>
        <div className="container">
          <div className="container-xxl">
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  Chứng chỉ
                </h6>
                <h2>{certificateByCourse?.courseName}</h2>
              </div>
              <div className="row g-4 justify-content-center">
                <img
                  className="shadow-effect"
                  style={{ width: "50%" }}
                  src={imageUrl}
                  alt=""
                />
              </div>
              <div className="row g-4 justify-content-center mt-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="confirmCheckbox"
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="confirmCheckbox">
                    Tôi xác nhận đã nhận chứng chỉ
                  </label>
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleConfirm}
                  disabled={!isChecked}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientShared>
  );
};

export default ConfirmCertificate;
