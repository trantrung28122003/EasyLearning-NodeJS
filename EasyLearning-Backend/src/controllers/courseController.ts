
import Course from '../models/course';
import Category from '../models/category';
import Order from '../models/oder';
import ShoppingCart from '../models/shoppingCart';
import ShoppingCartItem from '../models/shoppingCartItem';
import OrderDetail from '../models/orderDetail';
import Feedback from '../models/feedback';
import UserFavorite from '../models/userFavorite';
import { CourseRequest } from '../dtos/request/courseRequest';
import { createCourseDetail, deleteByCourseId, softDeleteDetailByCourseId } from './courseDetailController';
import { CourseType } from '../enums/courseType.enum';
import courseDiscount from '../models/courseDiscount';
import * as FeebackController from '../controllers/feedbackController';
import * as TrainingPartController from '../controllers/trainingPartController'
import * as CourseEventControler from '../controllers/courseEventController'
import * as DiscountController from '../controllers/discountController'
import * as UserTrainingProgressController from '../controllers/userTrainingProgressController'
import { CourseEventResponse } from '../dtos/response/courseEventResponse';
import { Types } from 'mongoose';
import { DetailCourseResponse } from '../dtos/response/detailCourseResponse';






export const getAllCourses = async () => {
  return await Course.find({ isDeleted: false });
};


export const getTopFourMostRegisteredCourses = async () => {
    return await Course.find()
      .sort({ registeredUsers: -1 }) 
      .limit(4); 
};

export const getAllCourseWithDiscount = async () => {
    const courseIds = await courseDiscount.distinct('courseId');
    const courses = await Course.find({ _id: { $in: courseIds } });
    return courses;
  };


export const getCourseWithFree = async () => {
    return await Course.find({ isFree: true, isDeleted: false });
};

export const getCoursesByUser = async (userId: string) => {
    return await Course.find({ createdBy: userId, isDeleted: false });
};

export const getCourseById = async (id: string) => {
    const course = await Course.findById(id);
    if (!course || course.isDeleted) 
        throw new Error('Khoá học không tồn tại');
    return course;
};

export const createCourse = async (data: CourseRequest) => {
    const newCourse = new Course({
        courseName: data.courseName,
        courseDescription: data.courseDescription || '',
        coursePrice: data.coursePrice || 0,
        requirements: data.requirements || '',
        courseType: data.courseType || '',
        courseContent: data.courseContent || '',
        instructor: data.instructor || '',
        startDate: data.startDate,
        endDate: data.endDate,
        isFree: data.isFree,
        imageUrl: data.imageUrl || '',
        registrationDeadline: data.registrationDeadline,
        maxAttendees: data.maxAttendees || 0,
        registeredUsers: data.registeredUsers || 0,
        changedBy: data.changedBy || 'SYSTEM',
       
    });
    const createCourse = await newCourse.save();
    const validCategories = await Category.find({
        _id: { $in: data.categories },
        isDeleted: false
    }).select('_id');

    const validCategoryIds = validCategories.map(c => c._id!.toString());

    if (createCourse._id && data.categories && validCategoryIds.length > 0) {
        await createCourseDetail(createCourse._id.toString(), validCategoryIds, data.changedBy);
    }
    return createCourse;
};

export const updateCourse = async (id: string, data: CourseRequest) => {
    const course = await Course.findById(id);
    if (!course || course.isDeleted) throw new Error('Khoá học không tồn tại');

    course.courseName = data.courseName ?? course.courseName;
    course.courseDescription = data.courseDescription ?? course.courseDescription;
    course.coursePrice = data.coursePrice ?? course.coursePrice;
    course.requirements = data.requirements ?? course.requirements;
    if(data.courseType && Object.values(CourseType).includes(data.courseType as CourseType))
    {
        course.courseType = data.courseType as CourseType;
    }
    course.courseContent = data.courseContent ?? course.courseContent;
    course.instructor = data.instructor ?? course.instructor;
    course.startDate = new Date(data.startDate ?? course.startDate);
    course.endDate =new Date(data.endDate ?? course.endDate);
    course.registrationDeadline =new Date(data.registrationDeadline ?? course.registrationDeadline);
    course.maxAttendees = data.maxAttendees ?? course.maxAttendees;
    course.registeredUsers = data.registeredUsers ?? course.registeredUsers;
    course.isFree = data.isFree ?? course.isFree,
    course.changedBy = data.changedBy || 'SYSTEM';
    course.imageUrl = data.imageUrl ?? course.imageUrl;

    const updatedCourse = await course.save();

    const validCategories = await Category.find({
        _id: { $in: data.categories },
        isDeleted: false
    }).select('_id');

    const validCategoryIds = validCategories.map(c => c._id!.toString());

    if (updatedCourse._id && data.categories && validCategoryIds.length > 0) {
    
        await deleteByCourseId(updatedCourse._id.toString());
        await createCourseDetail(id, validCategoryIds, data.changedBy);
    }
    const updateCourse = await course.save();
    return updateCourse;
};

export const softDeleteCourse = async (id: string) => {
    const course = await Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!course) throw new Error('Khoá học không tồn tại');
    softDeleteDetailByCourseId(course._id!.toString());
    return course;
};

export const deleteCourse = async (id: string) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new Error('Khoá học không tồn tại');
  return course;
};



const getDetailCourse = async (courseId: string) => {
    try {
        const course = await Course.findById(courseId)
        .populate('learningOutcomes') 
        .exec();
        if (!course) {
            throw new Error(`Không tìm thấy khóa học với: ${courseId}`);
        }
        const trainingParts = await TrainingPartController.getTrainingPartsByCourseId(course._id!.toString()); 
        const feedbackReponse  = await FeebackController.getFeedbacksForCoursePublic(course._id!.toString());

        let totalFeedback = feedbackReponse.feedbacks.length;
        let averageRating = 0;
        if (totalFeedback > 0) {
            const totalRating = feedbackReponse.feedbacks.reduce((sum, feedback) => sum + feedback.feedbackRating, 0);
            averageRating = totalRating / totalFeedback;
        }

        let courseEventResponses:CourseEventResponse[] =[] ;

        for (const trainingPart of trainingParts) {
            const courseEvent = await CourseEventControler.getCourseEventsById(trainingPart.courseEvent._id.toString());
            if (courseEvent) {
                const courseEventResponse : CourseEventResponse = {
                    id: courseEvent._id!.toString(),
                    courseEventName: courseEvent.eventName,
                    location: courseEvent.location,
                    startTime: courseEvent.dateStart.toString(),
                    endTime: courseEvent.dateEnd.toString(),
                    trainingParts: [trainingPart],
                    totalPartsByCourseEvent: trainingParts.filter(p => {
                        const courseEventId = p.courseEvent._id;
                        const courseEventObjectId = new Types.ObjectId(courseEvent._id as string); 
                        return courseEventId.equals(courseEventObjectId);
                      }).length

                };

                if (!courseEventResponses.some(p => p.id === courseEventResponse.id)) {
                    courseEventResponses.push(courseEventResponse);
                }
            }
        }

        
        courseEventResponses = courseEventResponses.sort((a, b) => {
            const startTimeA = new Date(a.startTime).getTime();
            const startTimeB = new Date(b.startTime).getTime();
            return startTimeA - startTimeB;
        });
        

        const totalLearningTime = calculateTotalLearningTime(courseEventResponses);


        const coursePriceDiscount = await DiscountController.applyCourseDiscount(courseId, course.coursePrice);
        const finalPrice = coursePriceDiscount || course.coursePrice;

        const detailCourseResponse : DetailCourseResponse = {
            courseId: course._id as string,
            courseName: course.courseName,
            coursePrice: course.coursePrice,
            coursePriceDiscount: finalPrice,
            courseImage: course.imageUrl,
            nameInstructor: course.instructor,
            courseEventResponses,
            totalFeedback,
            averageRating,
            feedFeedbackInfoResponses: feedbackReponse.feedbacks,
            totalLearningTime,
            learningOutcomes: course.learningOutcomes,
            nextAvailableDate: course.nextAvailableDate?.toString(),
        };

        return detailCourseResponse;
    } catch (error : any ) {
        throw new Error(`Error fetching course details: ${error.message}`);
    }
};


const calculateTotalLearningTime = (courseEventResponses: CourseEventResponse[]) => {
    return courseEventResponses.reduce((totalTime, event) => {
        const startTime = new Date(event.startTime).getTime();
        const endTime = new Date(event.endTime).getTime();
        return totalTime + (endTime - startTime);
    }, 0);
};


export const searchCourses = async (query?: string, sortBy?: string, courseType?: string, rating?: number) => {
  
    let courses = await Course.find({
        isDeleted: false,
        $or: [
            { courseName: { $regex: query, $options: 'i' } },
            { courseDescription: { $regex: query, $options: 'i' } },
        ]
    });

    if (courseType && courseType !== '') {
        courses = courses.filter(course => course.courseType?.toLowerCase() === courseType.toLowerCase());
    }


    if (sortBy) {
        switch (sortBy.toLowerCase()) {
            case 'az':
                courses.sort((a, b) => a.courseName.localeCompare(b.courseName));
                break;
            case 'za':
                courses.sort((a, b) => b.courseName.localeCompare(a.courseName));
                break;
            case 'priceasc':
                courses.sort((a, b) => a.coursePrice - b.coursePrice);
                break;
            case 'pricedesc':
                courses.sort((a, b) => b.coursePrice - a.coursePrice);
                break;
        }
    }

    return courses;
};

export const isCourseOfflineFull = async (courseId: string): Promise<boolean> => {
    const course = await Course.findById(courseId);
    if (!course) return false;
  
    if (course.courseType === 'ONLINE') return false;
  
    return course.registeredUsers >= course.maxAttendees;
  };
  
  export const isRegistrationDateExpired = async (courseId: string): Promise<boolean> => {
    const course = await Course.findById(courseId);
    if (!course) return false;
  
    if (course.courseType === 'ONLINE') return false;
  
    if (!course.registrationDeadline) return false;
  
    const now = new Date();
    return now > course.registrationDeadline;
};


export const getCoursePurchasedByUser = async (currentUserId: string) => {
    const orders = await Order.find({ user: currentUserId })
    .populate({
      path: 'orderDetails',
      populate: {
        path: 'course',
        model: 'Course',
      },
    });
  
    const purchasedCourseResponses = [];
    for (const order of orders) {
        for (const orderDetail of order.orderDetails as any) {
          const course = orderDetail.course;
      
          if (!course) continue;
      
          const trainingParts = await TrainingPartController.getTrainingPartsByCourseId(course._id.toString());
          const totalTrainingPartByCourse = trainingParts.length;
      
          const courseEventResponses = await CourseEventControler.getCourseEventsByCourse(course._id);
          courseEventResponses.sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
      
          const completedPartsByCourse = await UserTrainingProgressController.getCompletedTrainingPartsOnCourses(course._id, currentUserId);
      
          purchasedCourseResponses.push({
            courseId: course._id,
            courseName: course.courseName,
            courseImage: course.imageUrl,
            instructor: course.instructor,
            courseType: course.courseType,
            startDate: course.startDate,
            endDate: course.endDate,
            totalTrainingPartByCourse,
            completedPartsByCourse,
            courseEventResponses,
          });
        }
      }
  
    return purchasedCourseResponses;
};

export const findCoursesByName = async (name: string) => {
    const courses = await Course.find({
      isDeleted: false,
      courseName: { $regex: name, $options: 'i' }, 
    });
  
    return courses;
};

export const getPurchasedCoursesSchedule = async (courseId: string, currentUserId: string) => {
  const avatarInstructor = "https://easylearning.blob.core.windows.net/images-videos/user1.jpgea0c0be2-11c0-4948-b908-fcfa615b7835";

  const course = await Course.findById(courseId);
  if (!course) throw new Error(`Không tìm thấy khóa học ${courseId}`);

  const trainingParts = await TrainingPartController.getTrainingPartsByCourseId(courseId);
  const trainingPartEventIds = trainingParts.map(tp => tp.courseEvent._id.toString());

  const allCourseEvents = await CourseEventControler.getAllCourseEvents();
  const courseEventResponses: any[] = [];

  for (const courseEvent of allCourseEvents) {
    if (trainingPartEventIds.includes(courseEvent._id as string)) {
      const alreadyExists = courseEventResponses.some(e => e.id === courseEvent._id!.toString());
      if (!alreadyExists) {

        const totalParts = await TrainingPartController.getTrainingPartsByCourseEventId(courseEvent._id!.toString());
        const completedParts = await UserTrainingProgressController.getCompletedTrainingPartsOnCourseEvent(courseEvent._id!.toString(),currentUserId);

        courseEventResponses.push({
          id: courseEvent._id,
          courseEventName: courseEvent.eventName,
          startTime: courseEvent.dateStart,
          endTime: courseEvent.dateEnd,
          location: courseEvent.location,
          totalPartsByCourseEvent: totalParts,
          completedPartsByCourseEvent: completedParts
        });
      }
    }
  }

  courseEventResponses.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return {
    courseId: course._id,
    courseName: course.courseName,
    avatarInstructor,
    nameInstructor: course.instructor,
    courseEventResponse: courseEventResponses
  };
};

const isCourseInCart = async (courseId: string, currentUserId: string) => {
    try {
        const shoppingCart = await ShoppingCart.findOne({ userId: currentUserId });
        if (!shoppingCart) return false;

        const shoppingCartItems = await ShoppingCartItem.find({ shoppingCartId: shoppingCart._id, isDeleted: false });

        return shoppingCartItems.some(item => item.course._id.toString()  === courseId);
    } catch (error: any) {
        throw new Error('Không thể kiểm tra khóa học trong giỏ hàng.');
    }
};

const isCourseInSchedule = async (courseId:string, currentUserId:string) => {
    try {
        const orders = await Order.find({ userId: currentUserId });
        for (const order of orders) {
            const orderdeatail = await OrderDetail.find({order: order});
            for (const orderDetail of orderdeatail) {
                if (orderDetail.course._id.toString() === courseId) {
                    return true;
                }
            }
        }
        return false;
    } catch (error: any) {
        throw new Error('Không thể kiểm tra khóa học trong lịch học.');
    }
};

const isFeedbackByUser = async (courseId: string, currentUserId: string) => {
    try {
        const feedbacks = await Feedback.find({ courseId });
        return feedbacks.some(feedback => feedback.user._id!.toString() === currentUserId);
    } catch (error: any) {
        throw new Error('Không thể kiểm tra phản hồi của người dùng.');
    }
};


const isCourseFavorited = async (courseId:string, currentUserId:string) => {
    try {
        const favorite = await UserFavorite.findOne({ userId: currentUserId, courseId });
        return !!favorite;
    } catch (error: any) {
        throw new Error('Không thể kiểm tra khóa học yêu thích.');
    }
};

export const getCourseStatus = async (courseId : string, currentUserId : string) => {
    try {
        let isPurchased = false;
        let isLearning = false;
        let isInCart = false;
        let isFeedback = false;
        let isFavorited = false;
        let isCourseFull = false; 
        let isRegistrationDateExpired = false; 
        let isFree = false; 

    
        if (await isCourseInCart(courseId, currentUserId)) {
            isInCart = true;
        }

    
        if (await isCourseInSchedule(courseId, currentUserId)) {
            isLearning = true;
            isPurchased = true;
        }

      
        if (await isFeedbackByUser(courseId, currentUserId)) {
            isFeedback = true;
        }

       
        if (await isCourseFavorited(courseId, currentUserId)) {
            isFavorited = true;
        }

       
        const courseStatusResponse = {
            isLearning,
            isInCart,
            isPurchased,
            isFeedback,
            isFavorited,
            isCourseFull,
            isRegistrationDateExpired,
            isFree
        };

        return courseStatusResponse;
    } catch (error :any) {
        throw new Error('Không thể lấy trạng thái khóa học.');
    }
};




  

