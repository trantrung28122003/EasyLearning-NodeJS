"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Chỉ chấp nhận ảnh hoặc video.'));
    }
};
const limits = {
    fileSize: 100 * 1024 * 1024,
};
const upload = (0, multer_1.default)({ storage, fileFilter, limits });
exports.default = upload;
