"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = require("./middlewares/errorHandler");
const initRoles_1 = require("./utils/initRoles");
const dotenv_1 = __importDefault(require("dotenv"));
const indexRouter_1 = __importDefault(require("./routers/indexRouter"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const roleRouter_1 = __importDefault(require("./routers/roleRouter"));
const morgan_1 = __importDefault(require("morgan"));
const initAdmin_1 = require("./utils/initAdmin");
const categoryRouter_1 = __importDefault(require("./routers/categoryRouter"));
const courseRouter_1 = __importDefault(require("./routers/courseRouter"));
const courseEventRouter_1 = __importDefault(require("./routers/courseEventRouter"));
const trainingPartRouter_1 = __importDefault(require("./routers/trainingPartRouter"));
const feedbackRouter_1 = __importDefault(require("./routers/feedbackRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(errorHandler_1.errorHandler);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)(process.env.SECRET_KEY_COOKIE));
app.use('/', indexRouter_1.default);
app.use('/users', userRouter_1.default);
app.use('/auth', authRouter_1.default);
app.use('/roles', roleRouter_1.default);
app.use('/categories', categoryRouter_1.default);
app.use('/courses', courseRouter_1.default);
app.use('/course-events', courseEventRouter_1.default);
app.use('/training-parts', trainingPartRouter_1.default);
app.use('/feedbacks', feedbackRouter_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
mongoose_1.default.connect(process.env.mongodb || '').then(() => {
    console.log('Connected to MongoDB');
    (0, initRoles_1.initializeRoles)();
    (0, initAdmin_1.initializeAdminUser)();
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});
