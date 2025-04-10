"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserByToken = exports.getUserByEmail = exports.getUserById = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const role_1 = __importDefault(require("../models/role"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.find({ isDeleted: false }).populate('roles');
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(id).populate('roles');
    if (!user)
        throw new Error('Người dùng không tồn tại');
    return user;
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email }).populate('roles');
    if (!user)
        throw new Error('Người dùng không tồn tại');
    return user;
});
exports.getUserByEmail = getUserByEmail;
const getUserByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ resetPasswordToken: token }).populate('roles');
    if (!user)
        throw new Error('Không tìm thấy người dùng với token');
    return user;
});
exports.getUserByToken = getUserByToken;
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, fullName, dayOfBirth, avatarUrl, password, role = 'USER' } = data;
    const existingUser = yield user_1.default.findOne({ email });
    if (existingUser)
        throw new Error('Email đã được sử dụng');
    const roleObj = yield role_1.default.findOne({ name: role });
    if (!roleObj)
        throw new Error('Role không tồn tại');
    const newUser = new user_1.default({
        userName,
        email,
        fullName,
        dayOfBirth,
        imageUrl: avatarUrl,
        password,
        roles: roleObj._id,
    });
    return yield newUser.save();
});
exports.createUser = createUser;
const updateUser = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(id);
    if (!user)
        throw new Error('Người dùng không tồn tại');
    const allowField = ['password', 'email', 'imageUrl'];
    Object.keys(body).forEach((key) => {
        if (allowField.includes(key)) {
            user[key] = body[key];
        }
    });
    return yield user.save();
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield user_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedUser)
        throw new Error('Người dùng không tồn tại');
    return deletedUser;
});
exports.deleteUser = deleteUser;
