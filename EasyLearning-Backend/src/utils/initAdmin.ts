import User from '../models/user';
import Role from '../models/role';
import { hashPassword } from '../utils/hashing';

export const initializeAdminUser = async () => {
  const adminUsername = 'superadmin';
  const adminEmail = 'superadmin@gmail.com';

  const existingUser = await User.findOne({ userName: adminUsername });
  if (existingUser) {
    console.log('Admin đã tồn tại');
    return;
  }

  const adminRole = await Role.findOne({ name: 'ADMIN', isDeleted: false });
  if (!adminRole) {
    console.log('Role ADMIN chưa tồn tại. Hãy chạy initializeRoles trước.');
    return;
  }

  const newPassword = 'Password@1234'
  await User.create({
    userName: adminUsername,
    email: adminEmail,
    fullName: 'Administrator',
    password: newPassword,
    roles: adminRole._id,
    isDeleted: false,
    changedBy: 'SYSTEM',
  });
  console.log('Đã tạo tài khoản admin mặc định');
};
