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
exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashing_1 = require("../utils/hashing");
const login = (userName, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ userName: userName });
    if (!user) {
        throw new Error('Tài khoản không tồn tại nè!');
    }
    if (user.isDeleted) {
        throw new Error('Tài khoản đã bị khóa');
    }
    const isMatch = yield (0, hashing_1.comparePassword)(password, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu không đúng');
    }
    const exp = Date.now() + 60 * 60 * 1000;
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
        exp: exp,
    }, process.env.SECRET_KEY);
    return token;
});
exports.login = login;
