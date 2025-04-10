import React from "react";
import "./Certificate.css";
import { CertificateResponse } from "../../model/Certificate";
import { saveAs } from "file-saver";

interface certificateProp {
  certificate: CertificateResponse;
}

const Certificate: React.FC<certificateProp> = ({ certificate }) => {
  const fetchedPdfUrl = certificate.certificateUrl;
  const imageUrl = fetchedPdfUrl.replace("/upload/", "/upload/f_jpg/");
  console.log(imageUrl);

  const handleDownloadCertificate = async () => {
    try {
      const responseImageUrl = await fetch(fetchedPdfUrl);
      const blob = await responseImageUrl.blob();
      saveAs(blob, `${certificate.userFullName}.pdf`);
    } catch (error) {}
  };

  const handleDetailCertificate = async () => {
    window.open(fetchedPdfUrl, "_blank");
  };
  return (
    <div className="container mt-5">
      <div
        className="row "
        style={{
          backgroundColor: "white",
          boxShadow: "0 6px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <img src={imageUrl} className="col-md-6 bg-img pdf-preview" />

        <div className="col-md-6 col-md-offset-6 p-30 text-center bg-white">
          <h3 className="mb-50 fw-bold" style={{ marginTop: "12px" }}>
            Chứng chỉ khóa học {certificate.courseName}
          </h3>
          <ul className="timeline">
            <li className="timeline">
              <button
                className="btn-detail-file"
                onClick={handleDetailCertificate}
              >
                Chi tiết chứng chỉ
              </button>
              <div className="timeline-badge"></div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h5 className="timeline-title">Bắt đầu</h5>
                  <p className="text-sm">{certificate.courseName}</p>
                  <p className="timeline-meta text-xs">
                    <i className="fas fa-map-marker-alt va-middle mr-5"></i>{" "}
                    <span className="va-middle mr-5">HCM city</span>{" "}
                    <i className="fas fa-calendar-alt va-middle mr-5"></i>{" "}
                    <span className="va-middle">12/12/2014</span>
                  </p>
                </div>
              </div>
            </li>

            <li className="timeline-inverted">
              <button
                className="btn-download-file"
                onClick={handleDownloadCertificate}
              >
                Tải về chứng chỉ
              </button>
              <div className="timeline-badge"></div>

              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h5 className="timeline-title">Hoàn thành</h5>
                  <p className="text-sm">Web Design</p>
                  <p className="timeline-meta text-xs">
                    <i className="fas fa-map-marker-alt va-middle mr-5"></i>{" "}
                    <span className="va-middle mr-5">HCM City</span>{" "}
                    <i className="fas fa-calendar-alt va-middle mr-5"></i>{" "}
                    <span className="va-middle">28/12/2024</span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Certificate;
