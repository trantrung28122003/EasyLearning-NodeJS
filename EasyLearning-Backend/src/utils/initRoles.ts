import Role from '../models/role';

export const initializeRoles = async () => {
  const defaultRoles = [
    {
      name: 'ADMIN',
      description: 'Quản trị viên hệ thống',
    },
    {
      name: 'USER',
      description: 'Người dùng thông thường',
    },
  ];

  for (const roleData of defaultRoles) {
    const existing = await Role.findOne({ name: roleData.name, isDeleted: false });

    if (!existing) {
      await Role.create({
        ...roleData,
        isDeleted: false,
        changedBy: 'SYSTEM', 
      });
      console.log(`✅ Đã tạo role: ${roleData.name}`);
    }
  }
};
