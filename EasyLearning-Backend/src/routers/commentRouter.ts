import { Router, Request, Response } from 'express';
import * as CommentController from '../controllers/commentController';
import { responseSuccess, responseError } from '../utils/responseHandler';
import { check_authentication } from '../utils/authen';
import { HttpCode } from "../enums/httpCode";
const router = Router();
import { Server } from 'socket.io';


router.get('/by-trainingPart', check_authentication, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const trainingPartId = req.query.trainingPartId as string;
        const commentsByTrainingPart = await CommentController.getCommentsByTrainingPartId(trainingPartId, user._id);
        return responseSuccess(res, commentsByTrainingPart, 'Lấy danh sách bình luận thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});

router.post('/add-comment', check_authentication, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const data = req.body;
        const newComment = await CommentController.addComment(data, user._id, req.app.get('io'));
        return responseSuccess(res, newComment, 'Thêm bình luận thành công');
    } catch (err: any) {
        return responseError(res, HttpCode.INTERNAL_SERVER, err.message);
    }
});
router.post('/add-reply', check_authentication , async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const data = req.body;
        const commentId = req.query.commentId as string;
        const newReply = await CommentController.addReplyToComment(commentId,data ,user._id,req.app.get('io') );
        return responseSuccess(res, newReply, 'Thêm phản hồi thành công');
        } catch (err: any) {
            return responseError(res, HttpCode.BAD_REQUEST, err.message);
        }
    }
);

export default router;
