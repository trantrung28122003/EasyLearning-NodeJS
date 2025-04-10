import React, { useState } from "react";

const CategoryList = () => {
  // Dữ liệu mẫu thể loại (có thể thay đổi theo nhu cầu ), (Chỉ có thể test tạm thời , không lưu được dữ liệu khi refresh)
  const [categories, setCategories] = useState([
    { id: 1, categoryName: "Thể loại 1", dateCreate: "2024-01-01", dateChange: "2024-01-05" },
    { id: 2, categoryName: "Thể loại 2", dateCreate: "2024-02-01", dateChange: "2024-02-05" },
    { id: 3, categoryName: "Thể loại 3", dateCreate: "2024-03-01", dateChange: "2024-03-05" },
  ]);

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [message, setMessage] = useState("");

  // Hàm để xử lý việc lưu thay đổi khi chỉnh sửa tên thể loại
  const handleUpdate = (id: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === id) {
          const now = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (YYYY-MM-DD)
          const [year, month, day] = now.split("-"); // Tách năm, tháng, ngày
          const formattedDate = `${day}-${month}-${year}`; // Đổi định dạng thành DD-MM-YYYY

          return {
            ...category,
            categoryName: newCategoryName,
            dateChange: formattedDate, // Gán ngày đã format
          };
        }
        return category; // Giữ nguyên các category không được chỉnh sửa
      })
    );
    setEditingCategoryId(null); // Đóng chế độ chỉnh sửa
    setNewCategoryName(""); // Reset giá trị
  };
  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa thể loại này?")) {
      setCategories(categories.filter((category) => category.id !== id));
      setMessage("Đã xóa thể loại thành công.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Danh sách thể loại</h1>
      <hr />

      <table className="table table-striped table-bordered">
        <thead className="bg-primary text-white">
          <tr>
            <th>Tên thể loại</th>
            <th>Ngày tạo</th>
            <th>Ngày cập nhật</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              {editingCategoryId === category.id ? (
                <>
                  {/* Chế độ chỉnh sửa */}
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </td>
                  <td>{category.dateCreate}</td>
                  <td>{category.dateChange}</td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleUpdate(category.id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingCategoryId(null)}
                    >
                      Hủy
                    </button>
                  </td>
                </>
              ) : (
                <>
                  {/* Hiển thị thông tin không chỉnh sửa */}
                  <td>{category.categoryName}</td>
                  <td>{category.dateCreate}</td>
                  <td>{category.dateChange}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setNewCategoryName(category.categoryName); // Khi nhấn sửa, điền tên cũ vào ô input
                      }}
                    >
                      <i className="bi bi-pencil-square"></i>
                      Sửa
                    </button>
                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(category.id)}>
                      <i className="bi bi-trash"></i>
                      Xóa
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
