import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { BASE_URL_CREATE_EVENT } from "../../../constants/API";
import AdminShared from "../Shared/AdminShared";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "ONLINE",
    location: "",
    dateStart: "",
    dateEnd: "",
    isDeleted: false,
    dateCreate: "",
    dateChange: "",
    changedBy: "admin",
  });

  const formatCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;
  };

  const currentDate = formatCurrentDate();
  const toISODate = (date: string) => `${date}T00:00:00`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventName || !formData.dateStart || !formData.dateEnd) {
      alert("Vui lòng điền đầy đủ thông tin sự kiện.");
      return;
    }

    // Kiểm tra giá trị ngày tháng trước khi gửi
    console.log("Formatted Start Date:", toISODate(formData.dateStart));
    console.log("Formatted End Date:", toISODate(formData.dateEnd));


    // Tạo đối tượng JSON thay vì FormData
    const eventRequest = {
      eventName: formData.eventName,
      eventType: formData.eventType,
      location: formData.location,
      dateStart: toISODate(formData.dateStart),
      dateEnd: toISODate(formData.dateEnd),
      isDeleted: formData.isDeleted,
      dateChange: currentDate,
      dateCreate: currentDate,
      changedBy: formData.changedBy,
    };

    // Gọi API với dữ liệu JSON
    DoCallAPIWithToken(BASE_URL_CREATE_EVENT, "post", eventRequest)
      .then((res) => {
        if (res.status === 200) {
          navigate("/admin/event");
        }
      })
      .catch((err) => {
        if (err.response) {
          alert(`Lỗi từ server: ${err.response.data.message}`);
        } else {
          alert(`Lỗi hệ thống: ${err.message}`);
        }
      });
  };

  const handleBack = () => {
    navigate("/admin/event");
  };

  return (
    <AdminShared>
      <h1 className="text-center text-primary mb-5 pt-4">Thêm Buổi Học Mới</h1>
      <div className="container bg-white p-5 rounded shadow" style={{ maxWidth: "1200px", margin: "0 auto", border: "1px solid #dee2e6" }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold">Tên buổi học</label>
            <input
              type="text"
              className="form-control"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Nhập tên sự kiện"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Hình thức</label>
            <select className="form-select" name="eventType" value={formData.eventType} onChange={handleInputChange}>
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

          <div className="text-center">
            <button type="submit" className="btn btn-primary btn-lg w-100">Tạo Sự Kiện</button>
          </div>
        </form>

        <div className="mt-3 text-center">
          <button onClick={handleBack} className="btn btn-danger btn-lg">Quay Lại</button>
        </div>
      </div>
    </AdminShared>
  );
};

export default CreateEvent;
