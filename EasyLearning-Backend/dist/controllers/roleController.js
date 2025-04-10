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
exports.createRoleService = exports.getAllRolesService = void 0;
const role_1 = __importDefault(require("../models/role"));
const getAllRolesService = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_1.default.find({ isDeleted: false });
    return roles;
});
exports.getAllRolesService = getAllRolesService;
const createRoleService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = data;
    const existing = yield role_1.default.findOne({ name });
    if (existing) {
        throw new Error("Role đã tồn tại");
    }
    const newRole = new role_1.default({ name, description });
    yield newRole.save();
    return newRole;
});
exports.createRoleService = createRoleService;
