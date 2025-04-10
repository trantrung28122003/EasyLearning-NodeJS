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
const courseEventType_enum_1 = require("../enums/courseEventType.enum");
const mongoose_1 = __importStar(require("mongoose"));
const courseEventSchema = new mongoose_1.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, enum: Object.values(courseEventType_enum_1.CourseEventType), required: true },
    location: { type: String },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    changedBy: { type: String },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    trainingParts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingPart' }],
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('CourseEvent', courseEventSchema);
