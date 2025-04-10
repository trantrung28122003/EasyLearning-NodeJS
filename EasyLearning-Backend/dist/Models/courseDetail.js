"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseDetailSchema = new mongoose_1.Schema({
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true, },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true, },
    changedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('CourseDetail', courseDetailSchema);
