import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminShared from "../Shared/AdminShared";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { BASE_URL_EVENT } from "../../../constants/API";

const BASE_URL_UPDATE_EVENT = `${BASE_URL_EVENT}/update`;

const UpdateEvent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  const [formData, setFormData] = useState({
    id: "",
    eventName: "",
    eventType: "ONLINE",
    location: "",
    dateStart: "",
    dateEnd: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Format date from ISO to YYYY-MM-DD
  const formatDate = (isoDate: string) => {
    return isoDate ? isoDate.split("T")[0] : "";
  };

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id || "",
        eventName: event.eventName || "",
        eventType: event.eventType || "online",
        location: event.location || "",
        dateStart: formatDate(event.dateStart),
        dateEnd: formatDate(event.dateEnd),
      });
    } else {
      navigate("/admin/event");
    }
  }, [event, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toISODate = (date: string) => `${date}T00:00:00`;

  const handleBack = () => {
    navigate("/admin/event");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventName || !formData.dateStart || !formData.dateEnd) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin buổi học.");
      return;
    }

    const eventData = {
      ...formData,
      dateStart: toISODate(formData.dateStart),
      dateEnd: toISODate(formData.dateEnd),
    };

    try {
      const response = await DoCallAPIWithToken(`${BASE_URL_UPDATE_EVENT}/${eventData.id}`, "PUT", eventData);

      if (response.status === 200) {
        navigate("/admin/event");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
        alert(`Lỗi từ server: ${error.response.data.message}`);
      } else {
        console.error("Lỗi hệ thống:", error.message);
        alert(`Lỗi hệ thống: ${error.message}`);
      }
    }
  };

  return (
    <AdminShared>
      <div className="container-fluid py-5">
        <div className="card shadow-lg" style={{ width: "100%", border: "1px solid #ddd", padding: "30px" }}>
          <div className="card-body p-5" style={{ fontSize: "1rem" }}>
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              <div className="text-center mb-5">
                <h1 className="display-4 text-primary fw-bold">Cập nhật thông tin buổi học</h1>
              </div>

              <div className="mb-4">
                <label className="form-label fs-5">Nội dung buổi học</label>
                <input
                  className="form-control form-control-sm"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung buổi học"
                  style={{ fontSize: "1rem", padding: "0.75rem" }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Hình thức</label>
                <select
                  className="form-select"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                >
                  <option value="ONLINE">ONLINE</option>
                  <option value="OFFLINE">OFFLINE</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Link phòng học online/offline</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Nhập link phòng học online/offline"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">Ngày bắt đầu</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateStart"
                    value={formData.dateStart}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">Ngày kết thúc</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateEnd"
                    value={formData.dateEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Lưu thay đổi
                </button>
              </div>
            </form>

            <div className="mt-2 text-center">
              <button onClick={handleBack} className="btn btn-danger btn-lg">
                Quay Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShared>
  );
};

export default UpdateEvent;
