export interface CourseEventRequest {
    eventName: string;
    eventType: string;
    location: string;
    dateStart: string;
    dateEnd: string;
    createdBy: string;
    changedBy?: string;
  }
  