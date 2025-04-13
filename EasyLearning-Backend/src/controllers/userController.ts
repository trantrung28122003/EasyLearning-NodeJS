import User from '../models/user';
import Role from '../models/role';
import * as ShoppingCartController from './shoppingCartController';
import { Types } from 'mongoose';


export const getAllUsers = async () => {
  return await User.find({ isDeleted: false }).populate('roles');
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).populate('roles');
  if (!user) throw new Error('Người dùng không tồn tại');
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).populate('roles');
  if (!user) throw new Error('Người dùng không tồn tại');
  return user;
};

export const getUserByToken = async (token: string) => {
  const user = await User.findOne({ resetPasswordToken: token }).populate('roles');
  if (!user) throw new Error('Không tìm thấy người dùng với token');
  return user;
};

export const createUser = async (data: any) => {
  try {
    const { userName, email, fullName, dayOfBirth, avatarUrl, password, role = 'USER' } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email đã được sử dụngggg');  
      throw new Error('Email đã được sử dụnggg');
    }

    const roleObj = await Role.findOne({ name: role });
    if (!roleObj) throw new Error('Role không tồn tại');

    const newUser = new User({
      userName,
      email,
      fullName,
      dayOfBirth,
      imageUrl: avatarUrl,
      password,
      roles: roleObj._id,
    });
    await ShoppingCartController.createShoppingCart((newUser._id as string));
    const savedUser = await newUser.save();
    return savedUser;
  } catch (err:any) {
    console.error("Lỗi khi tạo người dùng hoặc giỏ hàng: ", err.message);
    throw err; 
  }
};

export const updateUser = async (id: string, body: any) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');

  const allowField = ['password', 'email', 'imageUrl'];
  Object.keys(body).forEach((key) => {
    if (allowField.includes(key)) {
      (user as any)[key] = body[key];
    }
  });

  return await user.save();
};
export const updateProfile = async (id: string, fullName: string, avatarUrl: string | undefined) => {
  const user = await User.findById(id);
  if (!user) throw new Error('Người dùng không tồn tại');
  user.fullName = fullName;
  if (avatarUrl) user.imageUrl = avatarUrl;
  return await user.save();
};

export const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedUser) throw new Error('Người dùng không tồn tại');
  return deletedUser;
};
