import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/errorHandler';
import { initializeRoles } from './utils/initRoles';
import dotenv from 'dotenv';
import indexRouter from './routers/indexRouter';
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';
import roleRouter from './routers/roleRouter';
import morgan from 'morgan';
import { initializeAdminUser } from './utils/initAdmin';
import categoryRouter from './routers/categoryRouter';
import courseRouter from './routers/courseRouter';
import courseEvent from './routers/courseEventRouter'
import trainingPart from './routers/trainingPartRouter';
import learningOutcomes from './routers/learningOutcomes';
import feedback from './routers/feedbackRouter';
dotenv.config(); 
const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(errorHandler);
    app.use(morgan('dev'));
    app.use(express.json()); 
    app.use(express.urlencoded({ extended: false })); 
    app.use(cookieParser(process.env.SECRET_KEY_COOKIE));

    app.use('/', indexRouter);
    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/roles', roleRouter);
    app.use('/categories', categoryRouter);
    app.use('/courses', courseRouter);
    app.use('/course-events', courseEvent);
    app.use('/training-parts', trainingPart);
    app.use('/feedbacks', feedback);
    app.use('/learning-outcomes', learningOutcomes)

    app.get('/', (req: Request, res: Response) => {
        res.json({ message: 'Hello from server!' });
    });
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });

mongoose.connect(process.env.mongodb || '').then(() => {
    console.log('Connected to MongoDB')
    initializeRoles();
    initializeAdminUser();
    }).catch((err) => {
        console.log('Error connecting to MongoDB', err)
    });

