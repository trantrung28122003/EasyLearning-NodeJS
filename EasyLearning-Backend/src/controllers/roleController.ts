
import Role from "../models/role";

export const getAllRolesService = async () => {
  const roles = await Role.find({ isDeleted: false });
  return roles;
};

export const createRoleService = async ( data: any) => {
  const {name , description } = data
  const existing = await Role.findOne({ name });
  if (existing) {
    throw new Error("Role đã tồn tại");
  }

  const newRole = new Role({ name, description });
  await newRole.save();
  return newRole;
};
