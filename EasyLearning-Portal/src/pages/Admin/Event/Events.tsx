import React, { useEffect, useState } from "react";
import AdminShared from "../Shared/AdminShared";
import { Event } from "../../../model/Event";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { BASE_URL_EVENT } from "../../../constants/API";
import { HTTP_OK } from "../../../constants/HTTPCode";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate(); // Use useNavigate

  // Fetch events from the API
  const fetchEvents = () => {
    DoCallAPIWithToken(BASE_URL_EVENT, "GET")
      .then((res) => {
        if (res.status === HTTP_OK) {
          setEvents(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
  };

  // Delete an event from the database
  const deleteEvent = (eventId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa buổi học này?")) {
      DoCallAPIWithToken(`${BASE_URL_EVENT}/delete/${eventId}`, "DELETE")
        .then((res) => {
          if (res.status === HTTP_OK) {
            alert("Xóa buổi học thành công!");
            // After successful deletion, remove the event from the local state
            setEvents(events.filter((event) => event.id !== eventId));
          } else {
            alert("Xóa buổi học thất bại!");
          }
        })
        .catch((err) => {
          console.error("Error deleting event:", err);
        });
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <AdminShared>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary">Nội Dung Các Buổi Học</h1>
          <p className="text-muted">Quản lý nội dung và thông tin các buổi học</p>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-info"
            onClick={() => navigate("/admin/event/create")}
          >
            <i className="bi bi-plus-circle me-2"></i>Tạo Buổi Học Mới
          </button>
          <button className="btn btn-outline-danger">
            <i className="bi bi-arrow-left-circle me-2"></i>Quay Lại
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive shadow rounded">
          <table className="table table-hover table-bordered align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th>Nội Dung Buổi Học</th>
                <th>Thời Gian Bắt Đầu</th>
                <th>Thời Gian Kết Thúc</th>
                <th className="text-center">Địa Chỉ</th>
                <th>Hình Thức</th>
                <th className="text-center">Chức Năng</th>
              </tr>
            </thead>
            <tbody>
              {events &&
                events.map((event, index) => (
                  <tr key={index}>
                    <td>{event.eventName}</td>
                    <td>{event.dateStart}</td>
                    <td>{event.dateEnd}</td>
                    <td>{event.location}</td>
                    <td>{event.eventType}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() =>
                          navigate("/admin/event/update", {
                            state: { event },
                          })
                        }
                      >
                        <i className="bi bi-pencil-square"></i> Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          navigate("/admin/event/detail", {
                            state: { event },
                          })
                        }
                      >
                        <i className="bi bi-info-circle"></i> Chi Tiết
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShared>
  );
};

export default Events;
