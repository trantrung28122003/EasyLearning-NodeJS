import mongoose from 'mongoose';
import UserTrainingProgress from '../models/userTrainingProcess';
import * as TrainingPartController from './trainingPartController';
export const createUserTrainingProgress = async (data: any, session: any) => {
  session.startTransaction();
  try {
    const trainingProgress = new UserTrainingProgress(data);
    const result = await trainingProgress.save({ session });
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const getCompletedTrainingPartsOnCourses = async (courseId: string, currentUserId: string): Promise<number> => {
    try {
      const trainingParts = await TrainingPartController.getTrainingPartsByCourseId(courseId);
  
      let completedCount = 0;
  
      for (const part of trainingParts) {
        const progress = await UserTrainingProgress.findOne({
          userId: currentUserId,
          trainingPartId: part._id
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
                userId: currentUserId,
                trainingPartId: part._id,
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