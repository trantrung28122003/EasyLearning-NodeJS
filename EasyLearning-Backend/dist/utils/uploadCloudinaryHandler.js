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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVideoUpload = exports.handleImageUpload = exports.handleAvatarUpload = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const handleAvatarUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultUrl = 'https://res.cloudinary.com/demo/image/upload/v123456789/default_avatar.png';
    if (!file)
        return defaultUrl;
    try {
        const result = yield (0, cloudinary_1.uploadToCloudinary)(file.buffer);
        return result.secure_url || defaultUrl;
    }
    catch (error) {
        console.error('Error uploading avatar:', error);
        return defaultUrl;
    }
});
exports.handleAvatarUpload = handleAvatarUpload;
const handleImageUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        return '';
    const result = yield (0, cloudinary_1.uploadToCloudinary)(file.buffer);
    return result.secure_url || '';
});
exports.handleImageUpload = handleImageUpload;
const handleVideoUpload = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file)
        return '';
    try {
        const result = yield (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'elearning', 'video');
        return result.secure_url || '';
    }
    catch (error) {
        console.error('Error uploading video:', error);
        return '';
    }
});
exports.handleVideoUpload = handleVideoUpload;
