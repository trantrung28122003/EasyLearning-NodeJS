import Feedback, { IFeedback } from '../models/feedback';
import { FeedbackRequest  } from '../dtos/request/feedbackRequest';
import { toFeedbackInfoResponse } from '../mapper/feedbackMapper';
import { object } from 'joi';
import { Types } from 'mongoose';
import { FeedbackResponse } from 'src/dtos/response/feefbackResponse';

export const createFeedback = async (data: FeedbackRequest) => {
    const newFeedback = new Feedback({
        feedbackContent: data.feedbackContent,
        feedbackRating: data.feedbackRating,
        user: new Types.ObjectId(data.userId),
        course : new Types.ObjectId(data.courseId),
    });
    const savedFeedback = await newFeedback.save();
    return savedFeedback;
};

export const updateFeedback = async (feedbackId: string, data: FeedbackRequest) => {
    try {
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        throw new Error('Không tìm thấy đánh giá phản hồi');
      }
  
      feedback.feedbackContent = data.feedbackContent || feedback.feedbackContent;
      feedback.feedbackRating = data.feedbackRating || feedback.feedbackRating;
      feedback.user = data.userId ? new Types.ObjectId(data.userId) : feedback.user;
      feedback.course = data.courseId ? new Types.ObjectId(data.courseId) : feedback.course;
  
      const updatedFeedback = await feedback.save();
  
      return updatedFeedback;
    } catch (err: any) {
      throw new Error(err.message || 'Cập nhật đánh giá thất bại');
    }
  };
  

export const getFeedbackForCourse = async (courseId: string, currentUserId: string) => {
    const feedbacks: IFeedback[] = await Feedback.find({ course: courseId, isDeleted: false })
    const hasGivenFeedback = feedbacks.some((feedback) => {
        const userId = feedback.user instanceof Types.ObjectId
          ? feedback.user 
          : (feedback.user as any)._id;
        
        return userId.equals(new Types.ObjectId(currentUserId));
      });
    const feedbackInfos = await Promise.all(feedbacks.map(toFeedbackInfoResponse));
    const feedbackResponse: FeedbackResponse = {
      feedbacks: feedbackInfos,
      hasGivenFeedback
    };
    return feedbackResponse;
};

export const getFeedbacksForCoursePublic = async (courseId: string) => {
  const feedbacks: IFeedback[] = await Feedback.find({
    course: courseId,
    isDeleted: false
  });

  const feedbackInfos = await Promise.all(feedbacks.map(toFeedbackInfoResponse));
  const feedbackResponse: FeedbackResponse = {
    feedbacks: feedbackInfos,
    hasGivenFeedback : false
  };
  return feedbackResponse;
};

export const getFeedbacksWithFiveRating = async () => {
  const feedbacks: IFeedback[] = await Feedback.find({
    feedbackRating: 5,
    isDeleted: false
  });

  const feedbackInfos = await Promise.all(feedbacks.map(toFeedbackInfoResponse));
  const feedbackResponse: FeedbackResponse = {
    feedbacks: feedbackInfos,
    hasGivenFeedback: false 
  };

  return feedbackResponse;
};

