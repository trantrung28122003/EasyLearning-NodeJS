import React, { useState } from "react";
import AdminShared from "../Shared/AdminShared";
import { BASE_URL_CREATE_CATEGORY } from "../../../constants/API";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { HTTP_OK } from "../../../constants/HTTPCode";

const CreateCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [imageLink, setImageLink] = useState("");  // Giữ trạng thái imageLink
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bắt buộc bị bỏ trống
    if (!categoryName.trim()) {
      alert("Tên danh mục không thể để trống.");
      return;
    }

    // Chỉ tạo FormData với categoryName và imageLink
    const formData = new FormData();
    formData.append("categoryName", categoryName.trim());  // Thêm tên danh mục
    formData.append("imageLink", imageLink.trim());  // Đường dẫn ảnh

    setIsSubmitting(true);

    // Gửi dữ liệu với FormData
    DoCallAPIWithToken(BASE_URL_CREATE_CATEGORY, "POST", formData)
      .then((res) => {
        if (res.status === HTTP_OK) {
          alert("Thêm danh mục thành công.");
          window.location.href = "/admin/category";
        } else {
          alert(`Lỗi: ${res.statusText || "Không thể thêm danh mục."}`);
        }
      })
      .catch((err) => {
        console.error("Error creating category:", err.response?.data || err.message);
        alert("Thêm danh mục thất bại. Vui lòng thử lại.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <AdminShared>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary">Thêm Thể Loại Mới</h1>
          <p className="text-muted">Điền thông tin để thêm thể loại mới</p>
        </div>

        <form onSubmit={handleCreateCategory} className="shadow p-4 rounded bg-light">
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">
              Tên Danh Mục
            </label>
            <input
              type="text"
              id="categoryName"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục"
              required
            />
          </div>

          {/* Trường nhập đường dẫn ảnh */}
          <div className="mb-3">
            <label htmlFor="imageLink" className="form-label">
              Đường Dẫn Ảnh
            </label>
            <input
              type="text"
              id="imageLink"
              className="form-control"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
              placeholder="Nhập đường dẫn ảnh"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Thêm thể loại"}
            </button>
          </div>
        </form>
      </div>
    </AdminShared>
  );
};

export default CreateCategory;
