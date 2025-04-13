import { CourseEventRequest } from '../dtos/request/courseEventRequest';
import CourseEvent, { ICourseEvent } from '../models/courseEvent';
import { CourseEventType } from '../enums/courseEventType.enum';
import TrainingPart from '../models/trainingPart';
import * as UserTrainingProcessController from '../controllers/userTrainingProgressController';
import courseEvent from '../models/courseEvent';



export const getAllCourseEvents = async () => {
    return await CourseEvent.find({ isDeleted: false });
};

export const getCourseEventsByUser = async (userId: string) => {
    return await CourseEvent.find({ createdBy: userId, isDeleted: false });
};

export const getCourseEventsById = async (id:string) => {
   const courseEvent = await CourseEvent.findById(id);
     if (!courseEvent || courseEvent.isDeleted) throw new Error('Buổi học không tồn tại');
     return courseEvent;
};

export const getCourseEventsByCourse = async (courseId: string) => {
    const trainingParts = await TrainingPart.find({ course: courseId })
        .populate({
            path: 'courseEvent',
            match: { isDeleted: false },
            model: 'CourseEvent' 
        });
        const seen = new Set<string>();
        const courseEvents: ICourseEvent[] = [];

        for (const tp of trainingParts) {
            const event = tp.courseEvent as unknown as ICourseEvent;
            if (event && !seen.has(event._id!.toString())) {
            seen.add(event._id!.toString());
            courseEvents.push(event);
            }
        }
            
    return courseEvents;
};


export const getCourseEventByTrainingPartId = async (trainingPartId: string): Promise<ICourseEvent> => {
    const trainingPart = await TrainingPart.findById(trainingPartId);
    const couseEvent = await CourseEvent.findById(trainingPart?.courseEvent._id.toString())
    if (!trainingPart || !couseEvent) {
        throw new Error('Buổi học không tồn tại cho phần học này');
    }
    return couseEvent;

};


export const getCourseEventAndProcessByCourse = async (courseId: string, currentUserId: string) => {

    const courseEventMap = await  getCourseEventsByCourse(courseId);
    const courseEventResponses = [];

    for (const  courseEvent of courseEventMap) {

        const totalParts = await TrainingPart.countDocuments({ courseEvent: courseEvent._id });

        const completedParts = await UserTrainingProcessController.getCompletedTrainingPartsOnCourseEvent( courseEvent._id!.toString(), currentUserId)
       
        courseEventResponses.push({
            id: courseEvent,
            courseEventName: courseEvent.eventName,
            startTime: courseEvent.dateStart,
            endTime: courseEvent.dateEnd,
            location: courseEvent.location,
            totalPartsByCourseEvent: totalParts,
            completedPartsByCourseEvent: completedParts
        });
    }
    courseEventResponses.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.endTime).getTime());
    return courseEventResponses;
};


export const createCourseEvent = async (data: CourseEventRequest ) => {
    const newCourseEvent = new CourseEvent({
        ...data,
    });
    const savedCourseEvent = await newCourseEvent.save();
    return savedCourseEvent;
};

export const updateCourseEvent = async (id: string, data: CourseEventRequest) => {
    const courseEvent = await CourseEvent.findById(id);
    if (!courseEvent || courseEvent.isDeleted) {
        throw new Error('Buổi học không tồn tại');
    }
    courseEvent.eventName = data.eventName ?? courseEvent.eventName;
    if (data.eventType && Object.values(CourseEventType).includes(data.eventType as CourseEventType)) {
        courseEvent.eventType = data.eventType as CourseEventType;
    }
    courseEvent.location = data.location ?? courseEvent.location;
    courseEvent.dateStart = data.dateStart ? new Date(data.dateStart) : courseEvent.dateStart;
    courseEvent.dateEnd = data.dateEnd ? new Date(data.dateEnd) : courseEvent.dateEnd;
    const updated = await courseEvent.save();
    return updated;
};

export const softDeleteCourseEvent = async (id: string) => {
    const courseEvent = await CourseEvent.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!courseEvent) throw new Error('Buổi học không tồn tại');
    return courseEvent;
};

export const deleteCourseEvent = async (id: string) => {
  const courseEvent = await CourseEvent.findByIdAndDelete(id);
  if (!courseEvent) throw new Error('Buổi học không tồn tại');
  return courseEvent;
};

