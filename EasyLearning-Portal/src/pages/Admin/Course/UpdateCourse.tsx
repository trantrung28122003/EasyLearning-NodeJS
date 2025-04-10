import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// const BASE_URL_UPDATE_COURSE = BASE_URL_COURSE + "/update";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { BASE_URL_COURSE, BASE_URL_UPDATE_COURSE } from "../../../constants/API";

const UpdateCourse: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [updatedCourse, setUpdatedCourse] = useState({
    id: "",
    courseName: "",
    courseType: "online",
    courseDescription: "",
    coursePrice: "",
    requirements: "",
    courseContent: "",
    imageUrl: "",
    instructor: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxAttendees: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // State để lưu thông báo lỗi

  // Hàm chuyển đổi ngày từ ISO 8601 sang YYYY-MM-DD
  const formatDate = (isoDate: string) => {
    return isoDate ? isoDate.split("T")[0] : "";
  };

  // Cập nhật dữ liệu từ course (nếu có)
  useEffect(() => {
    if (course) {
      setUpdatedCourse({
        id: course.id || "",
        courseName: course.courseName || "",
        courseType: course.courseType || "online",
        courseDescription: course.courseDescription || "",
        coursePrice: course.coursePrice || "",
        requirements: course.requirements || "",
        courseContent: course.courseContent || "",
        imageUrl: course.imageUrl || "",
        instructor: course.instructor || "",
        startDate: formatDate(course.startDate),
        endDate: formatDate(course.endDate),
        registrationDeadline: formatDate(course.registrationDeadline),
        maxAttendees: course.maxAttendees || "",
      });
    }
  }, [course]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Hàm chuyển đổi ngày từ YYYY-MM-DD sang ISO 8601
  const toISODate = (date: string) => `${date}T00:00:00`;

  const handleBack = () => {
    navigate("/admin/course");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bắt buộc không được nhập
    if (
      !updatedCourse.courseName ||
      !updatedCourse.coursePrice ||
      !updatedCourse.instructor
    ) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin khóa học.");
      return;
    }

    const courseData = {
      ...updatedCourse,
      coursePrice: parseFloat(updatedCourse.coursePrice),
      maxAttendees: parseInt(updatedCourse.maxAttendees),
      startDate: toISODate(updatedCourse.startDate),
      endDate: toISODate(updatedCourse.endDate),
      registrationDeadline: toISODate(updatedCourse.registrationDeadline),
    };
    DoCallAPIWithToken(
      `${BASE_URL_UPDATE_COURSE}/${courseData.id}`,
      "put",
      courseData
    )
      .then((res) => {
        if (res.status === 200) {
          navigate("/admin/course");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.error("Lỗi từ server:", err.response.data);
          alert(`Lỗi từ server: ${err.response.data.message}`);
        } else {
          console.error("Lỗi hệ thống:", err.message);
          alert(`Lỗi hệ thống: ${err.message}`);
        }
      });
    // try {
    //   const response = await fetch(`${BASE_URL_UPDATE_COURSE}/${course.id}`, { // Sử dụng API URL cập nhật
    //     method: "PUT",
    //     headers: {

    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(courseData),
    //   });

    //   if (response.ok) {
    //     alert("Cập nhật khóa học thành công!");
    //     navigate("/admin/course");
    //   } else {
    //     const errorData = await response.json();
    //     setErrorMessage(errorData.message || "Cập nhật khóa học thất bại. Vui lòng thử lại!");
    //   }
    // } catch (error) {
    //   console.error("Có lỗi xảy ra:", error);
    //   setErrorMessage("Có lỗi xảy ra khi cập nhật khóa học!");
    // }
  };

  return (
    <div>
      <h1 className="text-center text-primary mb-5 pt-4">Cập Nhật Khóa Học</h1>
      <div
        className="container bg-white p-5 rounded shadow"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          border: "1px solid #dee2e6",
        }}
      >
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}{" "}
          {/* Hiển thị thông báo lỗi */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Tên khóa học</label>
              <input
                type="text"
                name="courseName"
                className="form-control"
                placeholder="Nhập tên khóa học"
                value={updatedCourse.courseName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Hình thức</label>
              <select
                name="courseType"
                className="form-select"
                value={updatedCourse.courseType}
                onChange={handleInputChange}
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>

            <div className="col-12 mb-4">
              <label className="form-label fw-bold">Mô tả chi tiết</label>
              <textarea
                name="courseDescription"
                className="form-control"
                rows={3}
                value={updatedCourse.courseDescription}
                onChange={handleInputChange}
                placeholder="Nhập mô tả chi tiết về khóa học"
              ></textarea>
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Giá</label>
              <input
                type="number"
                name="coursePrice"
                className="form-control"
                value={updatedCourse.coursePrice}
                onChange={handleInputChange}
                placeholder="Nhập giá khóa học"
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Yêu cầu</label>
              <input
                type="text"
                name="requirements"
                className="form-control"
                value={updatedCourse.requirements}
                onChange={handleInputChange}
                placeholder="Nhập các yêu cầu"
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Nội dung</label>
              <textarea
                name="courseContent"
                className="form-control"
                rows={2}
                value={updatedCourse.courseContent}
                onChange={handleInputChange}
                placeholder="Nhập nội dung khóa học"
              ></textarea>
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={updatedCourse.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={updatedCourse.endDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Hạn đăng ký</label>
              <input
                type="date"
                name="registrationDeadline"
                className="form-control"
                value={updatedCourse.registrationDeadline}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Giảng viên</label>
              <input
                type="text"
                name="instructor"
                className="form-control"
                value={updatedCourse.instructor}
                onChange={handleInputChange}
                placeholder="Nhập tên giảng viên"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Số học viên tối đa</label>
              <input
                type="number"
                name="maxAttendees"
                className="form-control"
                value={updatedCourse.maxAttendees}
                onChange={handleInputChange}
                placeholder="Nhập số học viên tối đa"
              />
            </div>

            <div className="col-12 mb-4">
              <label className="form-label fw-bold">Hình ảnh</label>
              <input
                type="text"
                name="imageUrl"
                className="form-control"
                value={updatedCourse.imageUrl}
                onChange={handleInputChange}
                placeholder="Nhập URL hình ảnh"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="col-12 d-grid mb-4">
              <button type="submit" className="btn btn-primary btn-lg">
                Cập Nhật Khóa Học
              </button>
            </div>
            <div className="mt-2 text-center">
              <button onClick={handleBack} className="btn btn-danger btn-lg">
                Quay Lại
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
