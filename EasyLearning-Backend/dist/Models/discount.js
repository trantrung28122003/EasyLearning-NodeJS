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
Object.defineProperty(exports, "__esModule", { value: true });
const discountType_enum_1 = require("../enums/discountType.enum");
const mongoose_1 = __importStar(require("mongoose"));
const discountSchema = new mongoose_1.Schema({
    discountCode: { type: String, required: true },
    discountName: { type: String, required: true },
    discountType: { type: String, enum: Object.values(discountType_enum_1.DiscountType), required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, required: true },
    value: { type: Number, required: true },
    usageLimit: { type: Number, required: true },
    usageCount: { type: Number, required: true },
    description: { type: String },
    changedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
    courseDiscounts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CourseDiscount' }],
    userDiscounts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'UserDiscount' }]
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Discount', discountSchema);
