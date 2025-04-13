import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";
import { initializeRoles } from "./utils/initRoles";
import dotenv from "dotenv";
import indexRouter from "./routers/indexRouter";
import userRouter from "./routers/userRouter";
import authRouter from "./routers/authRouter";
import roleRouter from "./routers/roleRouter";
import morgan from "morgan";
import { initializeAdminUser } from "./utils/initAdmin";
import categoryRouter from "./routers/categoryRouter";
import courseRouter from "./routers/courseRouter";
import courseEvent from "./routers/courseEventRouter";
import trainingPart from "./routers/trainingPartRouter";
import learningOutcomes from "./routers/learningOutcomes";
import feedback from "./routers/feedbackRouter";
import shoppingCartRouter from "./routers/shoppingCartRouter";
import paymentRouter from "./routers/paymentRouter";
import exerciseRouter from "./routers/exerciseRouter";
import trainingPartProgressRouter from "./routers/trainingProgressRouter";
import customerRouter from "./routers/customerRouter";
import discountRouter from "./routers/discountRouter";
import certificateRouter from "./routers/certificateRouter";
import commentRouter from "./routers/commentRouter";
import notificationRouter from "./routers/notificationRouter";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});


io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (data) => {
    const { room } = data;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("newComment", (comment) => {
    const { trainingPartId, newCommentResponse } = comment;
    io.to(`commentByTrainingPart${trainingPartId}`).emit(
      "newComment",
      newCommentResponse
    );
  });

  socket.on("newReply", (reply) => {
    const { trainingPartId, newReplyResponse } = reply;
    io.to(`commentByTrainingPart${trainingPartId}`).emit(
      "newComment",
      newReplyResponse
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
app.set("io", io);
// Cấu hình Express middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(morgan("dev"));
app.use(cookieParser(process.env.SECRET_KEY_COOKIE));

// Các routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/roles", roleRouter);
app.use("/categories", categoryRouter);
app.use("/courses", courseRouter);
app.use("/course-events", courseEvent);
app.use("/training-parts", trainingPart);
app.use("/feedbacks", feedback);
app.use("/learning-outcomes", learningOutcomes);
app.use("/shopping-carts", shoppingCartRouter);
app.use("/payments", paymentRouter);
app.use("/exercises", exerciseRouter);
app.use("/training-progress", trainingPartProgressRouter);
app.use("/customers", customerRouter);
app.use("/discounts", discountRouter);
app.use("/certificates", certificateRouter);
app.use("/comments", commentRouter);
app.use("/notifications", notificationRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

mongoose
  .connect(process.env.mongodb || "")
  .then(() => {
    console.log("Connected to MongoDB");
    initializeRoles();
    initializeAdminUser();
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
