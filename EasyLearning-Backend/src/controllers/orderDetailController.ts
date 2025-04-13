import OrderDetail from '../models/orderDetail';


export const getAllOrderDetails = async () => {
  return await OrderDetail.find();
};

export const getOrderDetailById = async (id: string) => {
  const orderDetail = await OrderDetail.findById(id);
  if (!orderDetail) {
    throw new Error(`không tìm thấy orderdeatail với: ${id}`);
  }
  return orderDetail;
};

export const createOrderDetail = async (data: any) => {
  try {
    const newOrderDetail = new OrderDetail(data);
    const result = await newOrderDetail.save();
    return result;
  } catch (error) {
    throw error;
  }
};
