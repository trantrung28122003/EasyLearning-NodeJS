import { TrainingPart, TrainingPartProgressResponses } from "./Course";

export interface Event {
  id: string;
  eventType: String;
  eventName: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  dateCreate: string;
  dateChange: string;
  changedBy: string;
  isDeleted: boolean;
  totalPartsByCourseEvent: number;
  completedPartsByCourseEvent: number;
  trainingParts: TrainingPart[];
  trainingPartProgressResponses: TrainingPartProgressResponses[];
}
export interface EventSlim {
  id: string;
  courseEventName: string;
  startTime: string;
  endTime: string;
  location: string;
  totalPartsByCourseEvent: number;
  completedPartsByCourseEvent : number;
  trainingParts: TrainingPart[];
  trainingPartProgressResponses: TrainingPartProgressResponses[];
}
