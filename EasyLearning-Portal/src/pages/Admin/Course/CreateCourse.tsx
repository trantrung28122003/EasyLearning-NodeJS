import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { BASE_URL_CATEGORY, BASE_URL_CREATE_COURSE } from "../../../constants/API";
import AdminShared from "../Shared/AdminShared";

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    courseName: "",
    courseType: "ONLINE",
    courseDescription: "",
    coursePrice: "",
    requirements: "",
    courseContent: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    instructor: "",
    maxAttendees: "",
    changedBy: "admin",
    imageUrl: "",
    dateChange: "",
    dateCreate: "",
    registeredUsers: "0",
    isDeleted: false,
    categories: [] as string[],
  });
  const formatDate = (isoDate: string) => {
    return isoDate ? isoDate.split("T")[0] : "";
  };


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

  useEffect(() => {
    DoCallAPIWithToken(BASE_URL_CATEGORY, "get")
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
      });
  }, []);
  const toISODate = (date: string) => `${date}T00:00:00`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Đảm bảo name của từng trường trùng khớp với key trong formData
    }));
  };

  // Đối với phần nhập liệu là các `select` (ví dụ thể loại), cần xử lý như sau:
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      categories: selectedCategoryIds,
    }));
  };


  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      imageUrl: e.target.value.trim(),
    });
  };

  const formatDateToLocalDateTime = (date: string) => {
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
      alert("Ngày không hợp lệ");
      return "";
    }
    return dateObject.toISOString();  // Chuyển thành chuỗi ISO 8601 đầy đủ, bao gồm giờ
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (
      !formData.courseName ||
      !formData.courseDescription ||
      !formData.coursePrice ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.registrationDeadline ||
      !formData.instructor ||
      !formData.maxAttendees ||
      !formData.changedBy
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }


    // Kiểm tra giá khóa học hợp lệ
    const formattedPrice = formData.coursePrice.trim() || "0.0";
    if (isNaN(parseFloat(formattedPrice)) || parseFloat(formattedPrice) <= 0) {
      alert("Giá khóa học phải là một số dương.");
      return;
    }

    // Kiểm tra số học viên tối đa hợp lệ
    const formattedMaxAttendees = formData.maxAttendees.trim() || "10";
    if (isNaN(parseInt(formattedMaxAttendees)) || parseInt(formattedMaxAttendees) <= 0) {
      alert("Số học viên tối đa phải là một số dương.");
      return;
    }

    // Kiểm tra thể loại
    if (formData.categories.length === 0) {
      alert("Vui lòng chọn ít nhất một thể loại.");
      return;
    }

    // Sử dụng toISODate để chuyển đổi ngày thành chuỗi ISO 8601 đầy đủ
    const CourseRequest = new FormData();
    CourseRequest.append("courseName", formData.courseName);
    CourseRequest.append("courseType", formData.courseType);
    CourseRequest.append("courseDescription", formData.courseDescription);
    CourseRequest.append("coursePrice", formattedPrice);
    CourseRequest.append("requirements", formData.requirements);
    CourseRequest.append("courseContent", formData.courseContent);
    CourseRequest.append("startDate", toISODate(formData.startDate)); // Dùng toISODate
    CourseRequest.append("endDate", toISODate(formData.endDate)); // Dùng toISODate
    CourseRequest.append("registrationDeadline", toISODate(formData.registrationDeadline)); // Dùng toISODate
    CourseRequest.append("instructor", formData.instructor);
    CourseRequest.append("maxAttendees", formattedMaxAttendees);
    CourseRequest.append("imageUrl", formData.imageUrl);
    CourseRequest.append("categories", JSON.stringify(formData.categories));
    CourseRequest.append("isDeleted", String(formData.isDeleted)); // Chuyển boolean thành string 'true' hoặc 'false'
    CourseRequest.append("changedBy", formData.changedBy);
    CourseRequest.append("dateChange", currentDate);
    CourseRequest.append("dateCreate", currentDate);
    CourseRequest.append("registeredUsers", formData.registeredUsers);
    // console.log("code request: " + formData);
    // console.log("code request: " + formData.courseName);
    // console.log("code request: " + formData.courseType);
    // console.log("code request: " + formData.courseContent);
    // console.log("code request: " + formData.courseDescription);
    // console.log("code request: " + formData.coursePrice);
    // console.log("code request: " + formData.requirements);
    // console.log("code request: " + formData.startDate);
    // console.log("code request: " + formData.endDate);
    // console.log("code request: " + formData.registrationDeadline);
    // console.log("code request: " + formData.instructor);
    // console.log("code request: " + formData.maxAttendees);
    // console.log("code request: " + formData.imageUrl);
    // console.log("code request: " + formData.categories);
    // console.log("code request: " + formData.isDeleted);
    // console.log("code request: " + formData.changedBy);
    // console.log("code request: " + formData.dateChange);
    // console.log("code request: " + formData.dateCreate);
    // console.log("code request: " + formData.registeredUsers);


    // Gửi yêu cầu API
    DoCallAPIWithToken(BASE_URL_CREATE_COURSE, "post", CourseRequest)
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
  };



  const handleBack = () => {
    navigate("/admin/course");
  };

  return (
    <AdminShared>
      <h1 className="text-center text-primary mb-5 pt-4">Thêm Khóa Học Mới</h1>
      <div className="container bg-white p-5 rounded shadow" style={{ maxWidth: "1200px", margin: "0 auto", border: "1px solid #dee2e6" }}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Tên khóa học</label>
              <input
                type="text"
                className="form-control"
                name="courseName"
                value={formData.courseName} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                placeholder="Nhập tên khóa học"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Hình thức</label>
              <select
                className="form-select"
                name="courseType"
                value={formData.courseType} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
              </select>
            </div>

            <div className="col-12 mb-4">
              <label className="form-label fw-bold">Mô tả chi tiết</label>
              <textarea
                className="form-control"
                name="courseDescription"
                value={formData.courseDescription} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                // rows={3}
                placeholder="Nhập mô tả chi tiết về khóa học"
              ></textarea>
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Giá</label>
              <input
                type="number"
                className="form-control"
                name="coursePrice"
                value={formData.coursePrice} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                placeholder="Nhập giá khóa học"
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Yêu cầu</label>
              <input
                type="text"
                className="form-control"
                name="requirements"
                value={formData.requirements} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                placeholder="Nhập các yêu cầu"
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Nội dung</label>
              <textarea
                className="form-control"
                name="courseContent"
                value={formData.courseContent} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                rows={2}
                placeholder="Nhập nội dung khóa học"
              ></textarea>
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Ngày bắt đầu</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={formData.startDate} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Ngày kết thúc</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={formData.endDate} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
              />
            </div>

            <div className="col-md-4 mb-4">
              <label className="form-label fw-bold">Hạn đăng ký</label>
              <input
                type="date"
                className="form-control"
                name="registrationDeadline"
                value={formData.registrationDeadline} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Giảng viên</label>
              <input
                type="text"
                className="form-control"
                name="instructor"
                value={formData.instructor} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                placeholder="Nhập tên giảng viên"
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">Số học viên tối đa</label>
              <input
                type="number"
                className="form-control"
                name="maxAttendees"
                value={formData.maxAttendees} // Liên kết với giá trị trong state
                onChange={handleInputChange} // Đảm bảo onChange được xử lý đúng
                placeholder="Nhập số học viên tối đa"
              />
            </div>

            <div className="col-12 mb-4">
              <label className="form-label fw-bold">Link hình ảnh</label>
              <input
                type="text"
                className="form-control"
                name="imageUrl"
                value={formData.imageUrl} // Liên kết với giá trị trong state
                onChange={handleImageUrlChange} // Đảm bảo onChange được xử lý đúng
                placeholder="Nhập đường link ảnh"
              />
            </div>

            <div className="col-12 mb-4">
              <label className="form-label fw-bold">Thể Loại</label>
              <select
                className="form-select"
                name="categories"
                value={formData.categories} // Liên kết với state
                onChange={handleCategoryChange} // Xử lý sự kiện thay đổi
              >
                <option value="" disabled>
                  Chọn thể loại
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>


            {/* <div className="col-12 mb-4">
              <label className="form-label fw-bold">Khóa học đã xóa</label>
              <input
                type="checkbox"
                className="form-check-input"
                name="deleted"
                checked={formData.deleted}  // Kiểm tra trạng thái của checkbox
                onChange={(e) => setFormData({ ...formData, deleted: e.target.checked })} // Cập nhật giá trị khi checkbox thay đổi
              />
            </div> */}
            <div className="col-12 d-grid mb-4">
              <button type="submit" className="btn btn-primary btn-lg">
                Thêm Khóa Học
              </button>
            </div>
          </div>
        </form>

        <div className="mt-2 text-center">
          <button onClick={handleBack} className="btn btn-danger btn-lg">
            Quay Lại
          </button>
        </div>
      </div>
    </AdminShared>
  );
};

export default CreateCourse;
