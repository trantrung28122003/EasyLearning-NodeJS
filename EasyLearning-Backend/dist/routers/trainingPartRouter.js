"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = require("express");
const TrainingPartController = __importStar(require("../controllers/trainingPartController"));
const responseHandler_1 = require("../utils/responseHandler");
const httpCode_1 = require("../enums/httpCode");
const authen_1 = require("../utils/authen");
const constants = __importStar(require("../utils/constants"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const uploadCloudinaryHandler_1 = require("../utils/uploadCloudinaryHandler");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainingParts = yield TrainingPartController.getAllTrainingParts();
        return (0, responseHandler_1.responseSuccess)(res, trainingParts, "Lấy danh sách training part thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message);
    }
}));
router.get('/my-training-part', authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const events = yield TrainingPartController.getTrainingPartsByUser(user._id);
        (0, responseHandler_1.responseSuccess)(res, events, 'Lấy phần học của bạn thành công');
    }
    catch (err) {
        (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, 'Lỗi khi lấy phần học');
    }
}));
router.get("/:courseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield TrainingPartController.getTrainingPartsByCourseId(req.params.courseId);
        const filtered = result.filter((tp) => !tp.isDeleted);
        return (0, responseHandler_1.responseSuccess)(res, filtered, "Lấy training part theo courseId thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.post("/:courseId", authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), upload_1.default.fields([{ name: "imageFile" }, { name: "videoFile" }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { courseId } = req.params;
        const user = req.user;
        const files = req.files;
        const imageFile = (_a = files === null || files === void 0 ? void 0 : files["imageFile"]) === null || _a === void 0 ? void 0 : _a[0];
        const videoFile = (_b = files === null || files === void 0 ? void 0 : files["videoFile"]) === null || _b === void 0 ? void 0 : _b[0];
        const imageUrl = imageFile ? yield (0, uploadCloudinaryHandler_1.handleImageUpload)(imageFile) : "";
        const videoUrl = videoFile ? yield (0, uploadCloudinaryHandler_1.handleVideoUpload)(videoFile) : "";
        const trainingPartData = Object.assign(Object.assign({}, req.body), { imageUrl,
            videoUrl, createdBy: user._id, changedBy: user._id });
        const created = yield TrainingPartController.createTrainingPart(courseId, trainingPartData);
        return (0, responseHandler_1.responseSuccess)(res, created, "Tạo training part thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.put("/:trainingPartId", authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), upload_1.default.fields([{ name: "imageFile" }, { name: "videoFile" }]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { trainingPartId } = req.params;
        const user = req.user;
        const files = req.files;
        let imageUrl;
        let videoUrl;
        const imageFile = (_a = files === null || files === void 0 ? void 0 : files["imageFile"]) === null || _a === void 0 ? void 0 : _a[0];
        const videoFile = (_b = files === null || files === void 0 ? void 0 : files["videoFile"]) === null || _b === void 0 ? void 0 : _b[0];
        if (imageFile) {
            imageUrl = yield (0, uploadCloudinaryHandler_1.handleImageUpload)(imageFile);
        }
        if (videoFile) {
            videoUrl = yield (0, uploadCloudinaryHandler_1.handleVideoUpload)(videoFile);
        }
        const updateData = Object.assign(Object.assign({}, req.body), { imageUrl,
            videoUrl, changedBy: user._id });
        const updated = yield TrainingPartController.updateTrainingPart(trainingPartId, updateData);
        return (0, responseHandler_1.responseSuccess)(res, updated, "Cập nhật training part thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.delete("/:trainingPartId", authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield TrainingPartController.deleteTrainingPart(req.params.trainingPartId);
        return (0, responseHandler_1.responseSuccess)(res, null, "Xoá training part thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.post("/softDelete/:trainingPartId", authen_1.check_authentication, (0, authen_1.check_authorization)(constants.MOD_PERMISSION), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield TrainingPartController.softDeleteTrainingPart(req.params.trainingPartId);
        return (0, responseHandler_1.responseSuccess)(res, null, "Xoá mềm training part thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
exports.default = router;
