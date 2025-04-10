import React from "react";
import AdminShared from "../Shared/AdminShared";
import { useLocation } from "react-router-dom"; // Import useLocation to get passed state

const EventDetail: React.FC = () => {
  const location = useLocation();
  const event = location.state?.event; // Retrieve the event data passed from the Events component

  if (!event) {
    return <div>Loading...</div>; // Handle the case where event data is not passed
  }

  return (
    <AdminShared>
      <div className="container py-5">
        <div className="card shadow-lg border-0 rounded-3" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h1 className="display-4 text-primary">Chi tiết buổi học</h1>
              <h2 className="text-muted">
                <strong>{event.eventName}</strong>
              </h2>
              <hr />
            </div>

            {/* Event Details */}
            {/* <div className="form-group mb-4">
              <label className="form-label fs-5">Khóa học</label>
              <div className="fs-5 text-muted">{event.courseName}</div>
            </div> */}

            <div className="form-group mb-4">
              <label className="form-label fs-5">Nội dung buổi học</label>
              <div className="fs-5 text-muted">{event.eventName}</div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label fs-5">Hình thức</label>
              <div className="fs-5 text-muted">{event.eventType}</div>
            </div>

            {/* Conditional Rendering for Online vs Offline */}
            {event.eventType === "Online" ? (
              <div className="form-group mb-4">
                <label className="form-label fs-5">Link phòng học online</label>
                <div className="fs-5 text-muted">{event.onlineLink}</div>
              </div>
            ) : (
              <div className="form-group mb-4">
                <label className="form-label fs-5">Địa chỉ</label>
                <div className="fs-5 text-muted">{event.location}</div>
              </div>
            )}

            <div className="form-group mb-4">
              <label className="form-label fs-5">Ngày bắt đầu</label>
              <div className="fs-5 text-muted">{event.dateStart}</div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label fs-5">Ngày kết thúc</label>
              <div className="fs-5 text-muted">{event.dateEnd}</div>
            </div>

            {/* Button to go back */}
            <div className="mt-4 text-center">
              <a href="#" className="btn btn-danger btn-lg" onClick={() => window.history.back()}>
                Quay Lại
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminShared>
  );
};

export default EventDetail;
