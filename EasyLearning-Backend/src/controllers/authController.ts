import User from '../models/user';;
import jwt from 'jsonwebtoken';
import { comparePassword } from '../utils/hashing';

export const login = async (userName: string, password: string): Promise<string> => {
    const user = await User.findOne({ userName: userName });
    if (!user) {
        throw new Error('Tài khoản không tồn tại nè!');
    }
    if (user.isDeleted) {
        throw new Error('Tài khoản đã bị khóa');
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu không đúng');
    }
    const exp = Date.now() + 60 * 60 * 1000; 
    const token = jwt.sign(
        {
        id: user._id,
        exp: exp,
        },
        process.env.SECRET_KEY!,
    );
    return token;
};

export const getMyInfo = async (currentUserId: string) => {
    try {
        const user = await User.findById(currentUserId).select('-password').populate('roles');;

        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }

        if (user.isDeleted) {
            throw new Error('Tài khoản đã bị khóa!');
        }

        return {
            id: user._id,
            userName: user.userName,
            email: user.email,
            fullName: user.fullName,
            imageUrl: user.imageUrl,
            role: (user.roles as any)?.name || 'Không có quyền',
        };
    } catch (error: any) {
        throw new Error(`Lỗi xác thực người dùng: ${error.message}`);
    }
};

