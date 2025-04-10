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
exports.initializeAdminUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const role_1 = __importDefault(require("../models/role"));
const initializeAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminUsername = 'superadmin';
    const adminEmail = 'superadmin@gmail.com';
    const existingUser = yield user_1.default.findOne({ userName: adminUsername });
    if (existingUser) {
        console.log('Admin đã tồn tại');
        return;
    }
    const adminRole = yield role_1.default.findOne({ name: 'ADMIN', isDeleted: false });
    if (!adminRole) {
        console.log('Role ADMIN chưa tồn tại. Hãy chạy initializeRoles trước.');
        return;
    }
    const newPassword = 'Password@1234';
    yield user_1.default.create({
        userName: adminUsername,
        email: adminEmail,
        fullName: 'Administrator',
        password: newPassword,
        roles: adminRole._id,
        isDeleted: false,
        changedBy: 'SYSTEM',
    });
    console.log('Đã tạo tài khoản admin mặc định');
});
exports.initializeAdminUser = initializeAdminUser;
