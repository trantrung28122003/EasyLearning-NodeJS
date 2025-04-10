import { TrainingPartRequest } from "../dtos/request/trainingPartRequest";
import TrainingPart from "../models/trainingPart";
import { TrainingPartType } from "../enums/trainingPartType.enum";
import { Types } from "mongoose";

export const getAllTrainingParts = async () => {
    return await TrainingPart.find({ isDeleted: false });
};

export const getTrainingPartsByUser = async (userId: string) => {
    return await TrainingPart.find({ createdBy: userId, isDeleted: false });
};
export const getTrainingPartsByCourseId = async (courseId: string) => {
    return await TrainingPart.find({
      course: courseId,
      isDeleted: false,
    }).sort({ startTime: 1 }); 
};

export const getTrainingPartsByCourseEventId = async (courseEventId: string) => {
    return await TrainingPart.find({
        courseEvent: new Types.ObjectId(courseEventId),
        isDeleted: false,
    }).sort({ startTime: 1 }); 
};

export const createTrainingPart = async (courseId: string, data: TrainingPartRequest) => {
    const newTrainingPart = new TrainingPart({
        trainingPartName: data.trainingPartName,
        startTime: data.startTime ? new Date(data.startTime) : new Date(),
        endTime: data.endTime ? new Date(data.endTime) : new Date(),
        description: data.description || "",
        trainingPartType: data.trainingPartType,
        imageUrl: data.imageUrl || "",
        videoUrl: data.videoUrl || "",
        isFree: data.isFree,
        course: new Types.ObjectId(courseId),
        courseEvent: new Types.ObjectId(data.courseEventId),
        createdBy: data.createdBy,
        changedBy: data.changedBy || "SYSTEM",
        userTrainingProgress: [],
        comments: [],
        exerciseQuestions: [],
    });
    const savedTrainingPart = await newTrainingPart.save();
    return savedTrainingPart;
};

export const updateTrainingPart = async (id: string,data: TrainingPartRequest) => {
    const trainingPart = await TrainingPart.findById(id);
    if (!trainingPart || trainingPart.isDeleted) {
        throw new Error("Phần học không tồn tại");
    }

    trainingPart.trainingPartName =data.trainingPartName ?? trainingPart.trainingPartName;
    if (data.trainingPartType &&Object.values(TrainingPartType).includes(data.trainingPartType as TrainingPartType)
    ) {
        trainingPart.trainingPartType = data.trainingPartType as TrainingPartType;
    }
    trainingPart.description = data.description ?? trainingPart.description;
    trainingPart.startTime = data.startTime? new Date(data.startTime): trainingPart.startTime;
    trainingPart.endTime = data.endTime? new Date(data.endTime): trainingPart.endTime;
    trainingPart.imageUrl = data.imageUrl ?? trainingPart.imageUrl;
    trainingPart.videoUrl = data.videoUrl ?? trainingPart.videoUrl;
    trainingPart.isFree = data.isFree ?? trainingPart.isFree;
    trainingPart.changedBy = data.changedBy || trainingPart.changedBy;

    const updated = await trainingPart.save();
    return updated;
};

export const softDeleteTrainingPart = async (id: string) => {
    const trainingPart = await TrainingPart.findByIdAndUpdate(id,{ isDeleted: true },{ new: true });
    if (!trainingPart) throw new Error("Phần học không tồn tại");
    return trainingPart;
};

export const deleteTrainingPart = async (id: string) => {
    const trainingPart = await TrainingPart.findByIdAndDelete(id);
    if (!trainingPart) throw new Error("Phần học không tồn tại");
    return trainingPart;
};
