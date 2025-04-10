import { CourseEventRequest } from '../dtos/request/courseEventRequest';
import CourseEvent, { ICourseEvent } from '../models/courseEvent';
import { CourseEventType } from '../enums/courseEventType.enum';
import trainingPart from 'src/models/trainingPart';

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
    const trainingParts = await trainingPart.find({ course: courseId })
        .populate({
            path: 'courseEvent',
            match: { isDeleted: false },
            model: 'CourseEvent' 
        });
  
        const courseEvents = trainingParts
            .map(tp => tp.courseEvent as unknown as ICourseEvent)
            .filter(event => event); 

  return courseEvents;
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

