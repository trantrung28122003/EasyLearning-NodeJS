
import { FeedbackInfoResponse } from '../dtos/response/feefbackResponse';
import { IFeedback } from '../models/feedback';
import User, { IUser } from '../models/user';  

export const toFeedbackInfoResponse = async (feedback: IFeedback): Promise<FeedbackInfoResponse> => {
    await feedback.populate('user', 'imageUrl fullName'); 
    const user = feedback.user as IUser;
    return {
        id: feedback._id!.toString(),
        courseId: feedback.course.toString(),
        userId: user._id!.toString(),
        typeUser: 'Khách hàng',
        avatar: user?.imageUrl || '',
        fullName: user?.fullName || '',
        content: feedback.feedbackContent,
        feedbackRating: feedback.feedbackRating,
        createdAt: feedback.createdAt!.toString(),
    };
};

