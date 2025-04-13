import { Server, Socket } from 'socket.io';

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected');


    socket.on('join-room', (trainingPartId: string) => {
      if (trainingPartId) {
        socket.join(trainingPartId);
        console.log(`User joined room: ${trainingPartId}`);
      } else {
        console.log('Invalid trainingPartId');
      }
    });

    // Lắng nghe sự kiện 'newComment'
    socket.on('newComment', (data) => {
      if (data && data.trainingPartId) {
        console.log('New comment received:', data);
        io.to(data.trainingPartId).emit('newComment', data); // Gửi đến phòng tương ứng
      } else {
        console.log('Invalid data for new comment');
      }
    });

    // Lắng nghe sự kiện 'newReply'
    socket.on('newReply', (data) => {
      if (data && data.trainingPartId) {
        console.log('New reply received:', data);
        io.to(data.trainingPartId).emit('newReply', data); // Gửi đến phòng tương ứng
      } else {
        console.log('Invalid data for new reply');
      }
    });

    // Khi người dùng rời khỏi phòng hoặc ngắt kết nối
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
