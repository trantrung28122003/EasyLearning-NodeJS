import UserNote from '../models/userNote';
import TrainingPart from '../models/trainingPart';
import CourseEvent from '../models/courseEvent';
import * as CourseEventController from '../controllers/courseEventController';

export const getNotesByCourseIdAndUserId = async (courseId: string, currentUserId: string) => {
    const userNotes = await UserNote.find({
        course: courseId, 
        user: currentUserId, 
        isDeleted: false });
   
    const result = [];

    for (const userNote of userNotes) {
        const trainingPart =  await TrainingPart.findById(userNote.trainingPart);

        const courseEvent =  await CourseEventController.getCourseEventByTrainingPartId(userNote.trainingPart);

        result.push({
        id: userNote._id,
        noteContent: userNote.noteContent,
        trainingPartName: trainingPart?.trainingPartName || null,
        trainingPartId: trainingPart?._id || null,
        timeStamp: userNote.timeStamp,
        courseEventName: courseEvent?.eventName || null,
        });
    }
    return result;
};

export const createUserNote = async (data: any, currentUserId: string) => {

    const newNote = new UserNote({
        noteContent: data.noteContent,
        timeStamp: data.timestamp,
        course: data.courseId,
        trainingPart: data.trainingPartId,
        user: currentUserId,
        changedBy:currentUserId,
    });

    await newNote.save();

    const trainingPart =  await TrainingPart.findById(newNote.trainingPart);
    const courseEvent =  await CourseEventController.getCourseEventByTrainingPartId(newNote.trainingPart);

    return {
        id: newNote._id,
        noteContent: newNote.noteContent,
        couseId: data.courseId,
        trainingPartName: trainingPart?.trainingPartName,
        trainingPartId: trainingPart?._id,
        timeStamp: newNote.timeStamp,
        courseEventName: courseEvent?.eventName
    };
};

export const updateUserNote = async (id: string, data: any, currentUserId: string) => {
    const userNote = await UserNote.findById(id);
        if (!userNote) throw new Error('Ghi chú không tồn tại');
    
    userNote.noteContent = data.noteContent,
    userNote.changedBy = currentUserId,

    await userNote.save();

    const trainingPart =  await TrainingPart.findById(userNote.trainingPart);
    const courseEvent =  await CourseEventController.getCourseEventByTrainingPartId(userNote.trainingPart);

    return {
        id: userNote._id,
        noteContent: userNote.noteContent,
        couseId: data.courseId,
        trainingPartName: trainingPart?.trainingPartName,
        trainingPartId: trainingPart?._id,
        timeStamp: userNote.timeStamp,
        courseEventName: courseEvent?.eventName
    };
};


export const deleteUserNote = async (id : string) => {
    const note = await UserNote.findById(id);
        if (!note) throw new Error(`Ghi chú với ID: ${id} không tồn tại!`);
    await UserNote.findByIdAndDelete(id);
    return { success: true };
};
