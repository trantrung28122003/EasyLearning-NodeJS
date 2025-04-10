interface EventSchedule {
    eventId: string;
    courseName: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    instructor: string;
  }
interface Schedule {
    date: string;
    events: EventSchedule[];
}