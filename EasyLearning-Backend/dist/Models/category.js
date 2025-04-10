"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    categoryName: { type: String, required: true, maxlength: 50 },
    imageUrl: { type: String },
    sortOrder: { type: Number },
    changedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
    coursesDetails: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'CourseDetail' }]
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Category', categorySchema);
