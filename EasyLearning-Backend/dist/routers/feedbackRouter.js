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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedbackController = __importStar(require("../controllers/feedbackController"));
const responseHandler_1 = require("../utils/responseHandler");
const httpCode_1 = require("../enums/httpCode");
const authen_1 = require("../utils/authen");
const router = (0, express_1.Router)();
router.post('/:courseId', authen_1.check_authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { courseId } = req.params;
        console.log("tai khoan và khoa hoc" + user._id + 'khao hoc' + courseId);
        const feedbackData = Object.assign(Object.assign({}, req.body), { courseId: courseId, userId: user._id });
        console.log("feedback request", feedbackData);
        const feedback = yield FeedbackController.createFeedback(feedbackData);
        return (0, responseHandler_1.responseSuccess)(res, feedback, 'Gửi feedback thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.put('/:feedbackId', authen_1.check_authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield FeedbackController.updateFeedback(req.params.feedbackId, req.body);
        return (0, responseHandler_1.responseSuccess)(res, updated, 'Cập nhật feedback thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
router.get('/:courseId', authen_1.check_authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.params;
        const user = req.user;
        const response = yield FeedbackController.getFeedbackForCourse(courseId, user._id);
        return (0, responseHandler_1.responseSuccess)(res, response, 'Lấy feedback theo khóa học thành công');
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message);
    }
}));
exports.default = router;
