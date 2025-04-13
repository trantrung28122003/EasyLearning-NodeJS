import mongoose from 'mongoose';
import UserTrainingProgress from '../models/userTrainingProcess';
import * as TrainingPartController from './trainingPartController';
import * as CourseController from './courseController'
import * as CourseEventController from './courseEventController'
export const createUserTrainingProgress = async (data: any) => {

  try {
    const trainingProgress = new UserTrainingProgress(data);
    const result = await trainingProgress.save();

    return result;
  } catch (error) {
  
    throw error;
  }
};

export const updatePartProgress = async (trainingPartId: string, data: any, currentUserId: string) => {
  try {
    const userProgress = await UserTrainingProgress.findOne({
      user:currentUserId,
      trainingPart: trainingPartId,
    });

    if (!userProgress) throw new Error('Tiến độ học không tồn tại');

    let averageScore = 0.0;
    if (data && data.totalQuestionsCount > 0) {
      const correctAnswers = data.correctAnswersCount || 0;
      const totalQuestions = data.totalQuestionsCount || 1;
      averageScore = correctAnswers / totalQuestions;
      averageScore = Math.round(averageScore * 10.0) / 10.0;
    }

    const quizScore = Math.round(averageScore * 10);

    userProgress.isCompleted = true;
    userProgress.quizScore = quizScore;
    await userProgress.save();

    const trainingPart = await TrainingPartController.getTrainingPartsById(trainingPartId);
    if (!trainingPart) throw new Error('Không tìm thấy phần học');

    return {
      id: trainingPart._id,
      trainingPartName: trainingPart.trainingPartName,
      trainingPartType: trainingPart.trainingPartType,
      startTime: trainingPart.startTime,
      endTime: trainingPart.endTime,
      updatedAt: trainingPart.updatedAt,
      isFree: trainingPart.isFree,
      imageUrl: trainingPart.imageUrl,
      videoUrl: trainingPart.videoUrl,
      watchedDuration: userProgress.watchedDuration || 0,
      quizScore: userProgress.quizScore,
      completed: userProgress.isCompleted,
    };
  } catch (error: any) {
    console.error('Lỗi khi cập nhật tiến độ phần học:', error.message);
    throw new Error('Không thể cập nhật tiến độ phần học.');
  }
};


export const getCompletedTrainingPartsOnCourses = async (courseId: string, currentUserId: string): Promise<number> => {
    try {
      const trainingParts = await TrainingPartController.getTrainingPartsByCourseId(courseId);
  
      let completedCount = 0;
     
      for (const part of trainingParts) {
        const progress = await UserTrainingProgress.findOne({
          user: currentUserId,
          trainingPart: part._id
        });
      


        if (progress && progress.isCompleted === true) {
          
          completedCount++;
        }
      }
  
      return completedCount;
    } catch (error: any) {
      console.error('Lỗi khi lấy phần học đã hoàn thành:', error.message);
      throw new Error('Không thể lấy phần học đã hoàn thành.');
    }
};

export const getCompletedTrainingPartsOnCourseEvent = async (courseEventId: string, currentUserId: string): Promise<number> => {
    try {
        const trainingParts = await TrainingPartController.getTrainingPartsByCourseEventId(courseEventId);

        let completedCount = 0;
        for (const part of trainingParts) {
            const progress = await UserTrainingProgress.findOne({
                user: currentUserId,
                trainingPart: part._id,
            });

            if (progress && progress.isCompleted) {
                completedCount++;
            }
        }
        return completedCount;
    } catch (error: any) {
        console.error('Lỗi khi lấy phần học đã hoàn thành:', error.message);
        throw new Error('Không thể lấy phần học đã hoàn thành.');
    }
};


export const getUserTrainingProgressByCourse = async (courseId: string, currentUserId: string) => {
  try {

    const course = await CourseController.getCourseById(courseId);
    if (!course) throw new Error('Không tìm thấy khóa học');

    const trainingPartList = await TrainingPartController.getTrainingPartsByCourseId(courseId);
    const completedTrainingParts = await getCompletedTrainingPartsOnCourses(courseId, currentUserId);
    const totalTrainingParts = trainingPartList.length;

    const courseEvents = await CourseEventController.getCourseEventsByCourse(courseId);
    const courseEventResponseList: any[] = [];

    for (const trainingPart of trainingPartList) {
      for (const courseEvent of courseEvents) {
        if (String(courseEvent._id) === String(trainingPart.courseEvent._id)) {

          const alreadyAdded = courseEventResponseList.find(e => String(e.id) === String(courseEvent._id));
          if (alreadyAdded) continue;

          const trainingPartsByEvent = await TrainingPartController.getTrainingPartsByCourseEventId(courseEvent._id!.toString());

          const userTrainingProgressList = [];

          for (const trainingPart of trainingPartsByEvent) {
            const progress = await UserTrainingProgress.findOne({
              user: currentUserId,
              trainingPart: trainingPart._id
            });

            const trainingPartProgress = {
              id: trainingPart._id,
              trainingPartName: trainingPart.trainingPartName,
              trainingPartType: trainingPart.trainingPartType,
              startTime: trainingPart.startTime,
              endTime: trainingPart.endTime,
              isFree: trainingPart.isFree,
              imageUrl: trainingPart.imageUrl,
              videoUrl: trainingPart.videoUrl,
              watchedDuration: progress?.watchedDuration || 0,
              quizScore: progress?.quizScore || 0,
              completed: progress?.isCompleted || false
            };
            userTrainingProgressList.push(trainingPartProgress);
          }

          courseEventResponseList.push({
            id: courseEvent._id,
            courseEventName: courseEvent.eventName,
            startTime: courseEvent.dateStart,
            endTime: courseEvent.dateEnd,
            location: courseEvent.location,
            totalPartsByCourseEvent: trainingPartsByEvent.length,
            trainingPartProgressResponses: userTrainingProgressList,
            trainingParts: trainingPartsByEvent
          });
        }
      }
    }

    courseEventResponseList.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const userTrainingProgressStatusResponse = {
      courseName: course.courseName,
      courseInstructor: course.instructor,
      completedPartsByCourse: completedTrainingParts,
      totalPartsByCourse: totalTrainingParts,
      courseEventsResponses: courseEventResponseList
    };

    return userTrainingProgressStatusResponse;

  } catch (error) {
    console.error('Lỗi khi lấy tiến độ học:', error);
    throw new Error('Không thể lấy tiến độ học của người dùng.');
  }
};

export const getUserTrainingProgressByTrainingPart = async (trainingPartId: string, currentUserId:string) => {
  try {
    const progress = await UserTrainingProgress.findOne({
      user: currentUserId,
      trainingPart: trainingPartId,
    });
    return progress;
  } catch (error: any) {
    console.error('Lỗi khi lấy tiến độ học:', error.message);
    throw new Error('Không thể lấy tiến độ học.');
  }
};