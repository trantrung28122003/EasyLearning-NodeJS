import mongoose from 'mongoose';
import Order, { IOrder } from '../models/oder';
import OrderDetail from '../models/orderDetail';
import UserTrainingProgress from '../models/userTrainingProcess';
import Course from '../models/course';
import * as orderDetailController from './orderDetailController';
import * as userTrainingProgressService from './userTrainingProgressController';
import * as EmailController from './emailController';
import * as ShoppingCartItemController from './shoppingCartItemController';
import * as TrainingPartController from './trainingPartController';
import * as UserController from './userController';


export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const orders = await Order.find().exec();
    return orders;
  } catch (error: any) {
    console.error('Lỗi khi lấy tất cả đơn hàng:', error.message);
    throw new Error('Không thể lấy danh sách đơn hàng');
  }
};

export const getOrderById = async (id: string): Promise<IOrder> => {
  try {
    const order = await Order.findById(id).exec();
    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng với ID: ${id}`);
    }
    return order;
  } catch (error: any) {
    console.error(`Lỗi khi lấy đơn hàng theo ID: ${id}`, error.message);
    throw new Error(`Không thể lấy đơn hàng với ID: ${id}`);
  }
};


export const processPaymentAndCreateOrder = async (data: any, currentUserId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const shoppingCartItems = await ShoppingCartItemController.getShoppingCartItemsByCurrentUser(currentUserId);
    const orderAmount = parseFloat(data.amount);
    const order = new Order({
      orderTotalPrice: orderAmount,
      orderNotes: data.note,
      orderPaymentMethod: data.paymentMethod,
      orderQuantity: shoppingCartItems.length,
      user: currentUserId,
      changedBy: currentUserId,
      isDeleted: false,
      isFree: false
    });
    const savedOrder = await order.save({ session });

    for (const item of shoppingCartItems) {
      const orderDetail = new OrderDetail({
        orderId: savedOrder._id,
        courseId: item.course._id,
        orderDetailPrice: item.cartItemPrice,
        orderDetailDiscount: item.cartItemPriceDiscount,
        changedBy: "SYSTEM",
        isDeleted: false
      });
      await orderDetailController.createOrderDetail(orderDetail, session);
      const trainingPartsByCourse = await TrainingPartController.getTrainingPartsByCourseId(item.course._id.toString());
      for (const part of trainingPartsByCourse ) {
        const progress = new UserTrainingProgress({
          userId: currentUserId,
          trainingPartId: part._id,
          completed: false,
          watchedDuration: 0,
          quizScore: 0,
          changedBy: 'SYSTEM',
          dateChange: new Date(),
        });
        await userTrainingProgressService.createUserTrainingProgress(progress, session);
      }

      const course = await Course.findById(item.course._id);
      if (course) {
        course.registeredUsers += 1;
        await course.save({ session });
      }
    }

    
    for (const item of shoppingCartItems) {
      await ShoppingCartItemController.deleteShoppingCartItem((item._id as string), session);
    }

    const subject = 'Thanh toán thành công trên trang eLearning';
    const orderDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const courseNames = shoppingCartItems.map((item) => {
      const course = item.course as any;
      return course.courseName;
    });
    const userById = await UserController.getUserById(currentUserId);
    await EmailController.sendEmailPayment(
      userById.email,
      subject,
      userById.fullName,
      orderAmount,
      shoppingCartItems.length.toString(),
      savedOrder._id!.toString(),
      orderDate,
      courseNames
    );

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error :any) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi xử lý đơn hàng:', error.message);
    return false;
  }
};



export const addFreeCourseOrder = async (courseId: string, currentUserId: string): Promise<boolean> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const now = new Date();

    const course = await Course.findById(courseId).populate('trainingParts').session(session);
    if (!course) {
      throw new Error(`Course not found with id: ${courseId}`);
    }

    const order = new Order({
      orderTotalPrice: 0,
      orderNotes: 'Miễn phí',
      orderPaymentMethod: 'Miễn phí',
      orderQuantity: 1,
      user: currentUserId,
      changedBy: currentUserId,
      isDeleted: false,
      isFree: true,
      dateCreate: now,
      dateChange: now,
    });
    const savedOrder = await order.save({ session });
    const orderDetail = new OrderDetail({
      orderId: savedOrder._id,
      courseId: courseId,
      orderDetailPrice: 0,
      orderDetailDiscount: 0,
      changedBy: currentUserId,
      isDeleted: false,
      dateCreate: now,
      dateChange: now,
    });
    await orderDetailController.createOrderDetail(orderDetail, session);

    const progresses = course.trainingParts.map((part: any) => ({
      userId: currentUserId,
      trainingPartId: part._id,
      completed: false,
      watchedDuration: 0,
      quizScore: 0,
      changedBy: currentUserId,
      dateCreate: now,
      dateChange: now,
    }));

    for (const progress of progresses) {
      await userTrainingProgressService.createUserTrainingProgress(new UserTrainingProgress(progress), session);
    }


    await session.commitTransaction();
    session.endSession();
    return true;

  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error('Lỗi tạo order miễn phí:', error.message);
    return false;
  }
};


export const getPurchaseHistory = async (currentUserId: string): Promise<PurchaseHistoryResponse> => {
  try {
    const orders = await Order.find({ user: currentUserId })
      .populate({
        path: 'orderDetails',
        populate: {
          path: 'course',
          model: 'Course'
        }
      });

    const allOrderDetails: any[] = [];
    const orderDetailResponses: OrderDetailResponse[] = [];

    for (const order of orders) {
      allOrderDetails.push(...order.orderDetails);
    }

    for (const detail of allOrderDetails) {
      const course = detail.course;
      orderDetailResponses.push({
        price: detail.orderDetailPrice,
        priceDiscount: detail.orderDetailDiscount,
        courseName: course.courseName,
        isFree: course.isFree,
        orderDate: detail.dateCreate
      });
    }

    const initialAmount = allOrderDetails.reduce((sum, item) => {
      return sum + parseFloat(item.orderDetailPrice);
    }, 0);

    const discountedAmount = allOrderDetails.reduce((sum, item) => {
      return sum + parseFloat(item.orderDetailDiscount);
    }, 0);

    const sortedDates = allOrderDetails
      .map((detail) => new Date(detail.dateCreate))
      .sort((a, b) => a.getTime() - b.getTime());

    const purchaseHistoryResponse: PurchaseHistoryResponse = {
      initialAmount,
      discountedAmount,
      dateOfFirstPurchase: sortedDates[0] || null,
      dateOfLatestPurchase: sortedDates[sortedDates.length - 1] || null,
      orderDetailResponseList: orderDetailResponses
    };

    return purchaseHistoryResponse;

  } catch (error: any) {
    console.error('Lỗi khi lấy lịch sử mua hàng:', error.message);
    throw new Error('Không thể lấy dữ liệu lịch sử mua hàng');
  }
};


