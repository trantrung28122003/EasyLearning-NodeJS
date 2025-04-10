import React, { useEffect, useState } from "react";
import AdminShared from "../Shared/AdminShared";
import { Course } from "../../../model/Course";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { BASE_URL_COURSE } from "../../../constants/API";
import { HTTP_OK } from "../../../constants/HTTPCode";
import { useNavigate } from "react-router-dom";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  // Fetch courses from the server
  const fetchCourses = () => {
    DoCallAPIWithToken(BASE_URL_COURSE, "GET")
      .then((res) => {
        if (res.status === HTTP_OK) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Navigate to Update Course Page
  const handleEditClick = (course: Course) => {
    navigate("/admin/course/update", { state: { course } });
  };

  // Navigate to Course Details Page
  const handleDetailClick = (course: Course) => {
    navigate("/admin/course/details", { state: { course } });
  };

  // Delete course
  const handleDeleteClick = (courseId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
      // Gọi endpoint soft delete
      DoCallAPIWithToken(`${BASE_URL_COURSE}/softDelete/${courseId}`, "POST")
        .then((res) => {
          if (res.status === 200 || res.status === 204) {
            alert("Xóa khóa học thành công!");
            // Cập nhật lại danh sách khóa học sau khi soft delete
            setCourses(courses.filter((course) => course.id !== courseId));
          } else {
            alert("Xóa khóa học thất bại!");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi xóa khóa học:", err);
          alert("Đã xảy ra lỗi khi xóa khóa học!");
        });
    }
  };

  return (
    <AdminShared>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary">Quản Lý Khóa Học</h1>
          <p className="text-muted">Xem và quản lý các khóa học hiện có</p>
        </div>

        {/* Table */}
        <div className="table-responsive shadow rounded">
          <table className="table table-hover table-bordered align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col">Tên Khóa Học</th>
                <th scope="col" className="text-center">
                  Giá
                </th>
                <th scope="col">Ngày Bắt Đầu</th>
                <th scope="col">Ngày Kết Thúc</th>
                <th scope="col">Hạn Đăng Ký</th>
                <th scope="col">Sĩ Số</th>
                <th scope="col" className="text-center">
                  Chức Năng
                </th>
              </tr>
            </thead>
            <tbody>
              {courses &&
                courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.courseName}</td>
                    <td>{course.coursePrice}</td>
                    <td>{course.startDate}</td>
                    <td>{course.endDate}</td>
                    <td>{course.registrationDeadline}</td>
                    <td>{course.registeredUsers}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEditClick(course)}
                      >
                        <i className="bi bi-pencil-square"></i> Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleDetailClick(course)}
                      >
                        <i className="bi bi-info-circle"></i> Chi Tiết
                      </button>
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => handleDeleteClick(course.id)} // Pass course ID
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                      <button className="btn btn-sm btn-secondary me-2">
                        <i className="bi bi-list-ul"></i> Phần Học
                      </button>
                      <button className="btn btn-sm btn-success">
                        <i className="bi bi-calendar-check"></i> Buổi Học
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

export default Courses;
