import React, { useEffect, useState } from "react";
import AdminShared from "../Shared/AdminShared";

import { DoCallAPIWithToken } from "../../../services/HttpService";
import { AxiosResponse } from "axios";
import { BASE_URL_USER } from "../../../constants/API";

// Định nghĩa kiểu dữ liệu UserResponse
interface UserResponse {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  dayOfBirth: string;
  imageUrl: string;
  roles: { id: string; roleName: string }[];
  dateCreate: string;
  dateChange: string;
  changedBy: string;
  isDeleted: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]); // State để lưu trữ danh sách người dùng
  const [error, setError] = useState<string | null>(null);

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = () => {
    setError(null); // Reset lỗi mỗi khi gọi API
    DoCallAPIWithToken(BASE_URL_USER, "GET")
      .then((res: AxiosResponse<{ code: number; result: UserResponse[] }>) => {
        if (res.data.code === 200 && Array.isArray(res.data.result)) {
          setUsers(res.data.result); // Lưu dữ liệu vào state
        } else {
          setError("Có lỗi khi tải danh sách người dùng.");
          console.error(
            "Lỗi khi lấy danh sách người dùng: Dữ liệu không hợp lệ",
            res
          );
        }
      })
      .catch((err) => {
        setError("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      });
  };

  useEffect(() => {
    fetchUsers(); // Lấy danh sách người dùng khi component được render
  }, []);

  return (
    <AdminShared>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h1 className="display-6 fw-bold text-primary">Quản Lý Người Dùng</h1>
          <p className="text-muted">Xem danh sách người dùng</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}{" "}
        {/* Hiển thị lỗi nếu có */}
        <div className="table-responsive shadow rounded">
          <table className="table table-hover table-bordered align-middle">
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-center">Tên người dùng</th>
                <th>Email</th>
                <th>Họ và tên</th>
                <th>Ngày sinh</th>
                <th className="text-center">Ảnh</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td>{new Date(user.dayOfBirth).toLocaleDateString()}</td>
                    <td className="text-center">
                      <img
                        src={user.imageUrl}
                        alt="User Avatar"
                        className="rounded"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{new Date(user.dateCreate).toLocaleDateString()}</td>
                    <td>{new Date(user.dateChange).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShared>
  );
};

export default UserManagement;
