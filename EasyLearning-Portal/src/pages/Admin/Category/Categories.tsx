import React, { useEffect, useState } from "react";
import AdminShared from "../Shared/AdminShared";
import { Category } from "../../../model/Category";
import { BASE_URL_CATEGORY } from "../../../constants/API";
import { DoCallAPIWithToken } from "../../../services/HttpService";
import { HTTP_OK } from "../../../constants/HTTPCode";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Category | null>(null);

  const fetchCategories = () => {
    DoCallAPIWithToken(BASE_URL_CATEGORY, "GET")
      .then((res) => {
        if (res.status === HTTP_OK) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };

  const deleteCategory = (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    const deleteUrl = `${BASE_URL_CATEGORY}/delete/${id}`;
    DoCallAPIWithToken(deleteUrl, "DELETE")
      .then((res) => {
        if (res.status === HTTP_OK) {
          setCategories(categories.filter((category) => category.id !== id));
          alert("Xóa danh mục thành công");
        }
      })
      .catch((err) => {
        console.error("Error deleting category:", err);
        alert("Xóa danh mục thất bại");
      });
  };

  const startEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditData(category);
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
    setEditData(null);
  };

  const saveChanges = async (id: string) => {
    if (!editData) return;

    try {
      const res = await DoCallAPIWithToken(
        `${BASE_URL_CATEGORY}/update/${id}`,
        "PUT",
        editData
      );

      if (res.status === HTTP_OK) {
        alert("Cập nhật thành công!");
        setCategories(
          categories.map((cat) => (cat.id === id ? { ...cat, ...editData } : cat))
        );
        cancelEdit();
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Lỗi khi cập nhật danh mục.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <AdminShared>
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary">Quản Lý Thể Loại</h1>
          <p className="text-muted">Xem và quản lý các thể loại hiện có</p>
        </div>

        {/* Table */}
        <p>
          <a
            asp-action="Create"
            className="btn btn-info"
            onClick={() => (window.location.href = "/admin/category/create")}
          >
            <i className="fa fa-plus" style={{ marginRight: "10px" }}></i> Thêm thể loại mới
          </a>
        </p>
        <div className="table-responsive shadow rounded">
          <table className="table table-hover table-bordered align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col" className="text-center">
                  Tên Danh Mục
                </th>
                <th scope="col" className="text-center">
                  Ảnh
                </th>
                <th scope="col">Ngày Tạo</th>
                <th scope="col">Ngày Cập Nhật</th>
                <th scope="col" className="text-center">
                  Người Thay Đổi
                </th>
                <th scope="col" className="text-center">
                  Chức Năng
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={index}
                  className={`$ {index % 2 === 0 ? "bg-light" : ""} $ {editingCategoryId === category.id ? "editing" : ""}`}
                >
                  <td>
                    {editingCategoryId === category.id ? (
                      <input
                        type="text"
                        value={editData?.categoryName || ""}
                        onChange={(e) =>
                          setEditData({ ...editData!, categoryName: e.target.value })
                        }
                        className="form-control"
                      />
                    ) : (
                      category.categoryName
                    )}
                  </td>
                  <td className="text-center">
                    {editingCategoryId === category.id ? (
                      <input
                        type="text"
                        value={editData?.imageLink || ""}
                        onChange={(e) =>
                          setEditData({ ...editData!, imageLink: e.target.value })
                        }
                        className="form-control"
                      />
                    ) : (
                      <img
                        src={category.imageLink}
                        alt="Category"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </td>
                  <td>{new Date(category.dateCreate).toLocaleDateString()}</td>
                  <td>{new Date(category.dateChange).toLocaleDateString()}</td>
                  <td className="text-center">{category.changedBy}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {editingCategoryId === category.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveChanges(category.id)}
                          >
                            <i className="bi bi-pencil-square"></i> Lưu
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={cancelEdit}
                          >
                            <i className="bi bi-trash"></i> Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEdit(category)}
                          >
                            <i className="bi bi-pencil-square"></i> Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCategory(category.id)}
                          >
                            <i className="bi bi-trash"></i> Xóa
                          </button>
                        </>
                      )}
                    </div>
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

export default CategoryManagement;
