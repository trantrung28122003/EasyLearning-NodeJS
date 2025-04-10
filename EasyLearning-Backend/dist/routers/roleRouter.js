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
const express_1 = require("express");
const roleController_1 = require("../controllers/roleController");
const responseHandler_1 = require("../utils/responseHandler");
const httpCode_1 = require("../enums/httpCode");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield (0, roleController_1.getAllRolesService)();
        return (0, responseHandler_1.responseSuccess)(res, roles, "Lấy danh sách role thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.INTERNAL_SERVER, err.message || "Lỗi server khi lấy roles");
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const role = yield (0, roleController_1.createRoleService)({ name, description });
        return (0, responseHandler_1.responseSuccess)(res, role, "Tạo role thành công");
    }
    catch (err) {
        return (0, responseHandler_1.responseError)(res, httpCode_1.HttpCode.BAD_REQUEST, err.message || "Lỗi khi tạo role");
    }
}));
exports.default = router;
