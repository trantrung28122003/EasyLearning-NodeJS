import React from "react";
import AdminShared from "../Shared/AdminShared";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaImage } from "react-icons/fa";

const DetailCourse: React.FC = () => {
  const location = useLocation();
  const course = location.state?.course;
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/admin/course");
  };

  return (
    <AdminShared>
      <div className="container py-5 ">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">Chi Tiết Khóa Học</h2>
          <hr />
        </div>

        {/* Course Details */}
        <div className="row g-4">
          {/* Thông tin cơ bản */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex align-items-center">
                <FaClipboardList className="me-2" /> Thông Tin Cơ Bản
              </div>
              <div className="card-body">
                <p><strong>Tên khóa học:</strong> {course?.courseName}</p>
                <p><strong>Hình thức:</strong> {course?.courseType}</p>
                <p><strong>Học phí:</strong> {course?.coursePrice} VNĐ</p>
                <p><strong>Số học viên tối đa:</strong> {course?.maxAttendees}</p>
              </div>
            </div>
          </div>

          {/* Thời gian khóa học */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Thời Gian
              </div>
              <div className="card-body">
                <p><strong>Ngày bắt đầu:</strong> {course?.startDate}</p>
                <p><strong>Ngày kết thúc:</strong> {course?.endDate}</p>
                <p><strong>Hạn đăng ký:</strong> {course?.registrationDeadline}</p>
              </div>
            </div>
          </div>

          {/* Nội dung khóa học */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white d-flex align-items-center">
                <FaClipboardList className="me-2" /> Nội Dung Khóa Học
              </div>
              <div className="card-body">
                <p><strong>Mô tả:</strong> {course?.courseDescription}</p>
                <p><strong>Yêu cầu:</strong> {course?.courseRequirements}</p>
                <p><strong>Nội dung:</strong> {course?.courseContent}</p>
              </div>
            </div>
          </div>

          {/* Thông tin giảng viên */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-white d-flex align-items-center">
                <FaChalkboardTeacher className="me-2" /> Giảng Viên
              </div>
              <div className="card-body">
                <p><strong>Tên giảng viên:</strong> {course?.instructor}</p>
                <p><strong>Ngày tạo:</strong> {course?.dateCreate}</p>
                <p><strong>Ngày cập nhật:</strong> {course?.dateChange}</p>
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white d-flex align-items-center">
                <FaImage className="me-2" /> Hình Ảnh Khóa Học
              </div>
              <div className="card-body text-center">
                {course?.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt="Course"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                ) : (
                  <p>Không có hình ảnh</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-4">
          <button className="btn btn-outline-dark btn-lg" onClick={handleBackClick}>
            Quay Lại
          </button>
        </div>
      </div>
    </AdminShared>
  );
};

export default DetailCourse;
