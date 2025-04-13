import { Request, Response } from 'express';
import Comment from '../models/comment';
import Reply from '../models/reply';
import User from '../models/user';
import { Server } from 'socket.io';
export const getCommentsByTrainingPartId = async (trainingPartId : string, currentUserId: string) => {
  try {
    const comments = await Comment.find({ trainingPart: trainingPartId });
    const commentResponseList = [];
    for (let comment of comments) {
        const userOfComment = await User.findById(comment.user._id);
        const replyResponseList = [];
        const replies = await Reply.find({ _id: { $in: comment.replies } }).exec();
        for (let reply of replies) {
            const userOfReply = await User.findById(reply.user._id);
            const replyResponse = {
            id: reply._id,
            contentReply: reply.content,
            commentId: comment._id,
            userId: reply.user._id,
            userFullName: userOfReply?.fullName,
            userImageUrl: userOfReply?.imageUrl,
            dateCreate: reply.createdAt
            };
            replyResponseList.push(replyResponse);
        }

        const commentResponse = {
            id: comment._id,
            contentComment: comment.content,
            userId: comment.user._id,
            userFullName: userOfComment?.fullName,
            userImageUrl: userOfComment?.imageUrl,
            dateCreate: comment.createdAt,
            replies: replyResponseList,
        };

      commentResponseList.push(commentResponse);
    }
    return commentResponseList;
  } catch (error) {
    throw new Error('Có lỗi khi lấy bình luận');
  }
};


export const addComment = async (data: any, currentUserId: string, io: Server) => {
    try {
        const {commentContent, trainingPartId } = data;
        const currentUser = await User.findById(currentUserId); 
    
        if (!currentUser) {
            throw new Error('Không tìm thấy user nè');
        }
    
        const comment = new Comment({
            content: commentContent,
            user: currentUserId,
            trainingPart: trainingPartId,
            changedBy: currentUserId,
            replies: [], 
        });
    
        await comment.save();
    
        const commentResponse = {
            id: comment._id,
            contentComment: comment.content,
            userId: comment.user,
            userFullName: currentUser.fullName,
            userImageUrl: currentUser.imageUrl,
            dateCreate: comment.createdAt,
            replies: [],  
        };
        io.to(`commentByTrainingPart${trainingPartId}`).emit('newComment', commentResponse);
        return commentResponse;
        
    } catch (error: any) {

        throw new Error(`Có lỗi khi thêm mới bình luận: ${error.message}`);  
    }
  };
  

export const addReplyToComment = async (commentId: string, data: any, currentUserId: string, io:Server) => {
    try {
        const {replyContent} = data;
        const currentUser = await User.findById(currentUserId);
    
        if (!currentUser) {
            throw new Error('Không tìm thấy user nè');
        }

        const reply = new Reply({
            content: replyContent,
            user: currentUserId,
            changedBy: currentUserId,
            comment: commentId,
        });
    
        await reply.save();
    
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new Error('Bình luận không tồn tại');
        }
        comment.replies.push(reply._id as any); 
        await comment.save();
    
        const replyResponse = {
            id: reply._id,
            commentId: reply.comment._id,
            contentReply: reply.content,
            userId: reply.user,
            userFullName: currentUser.fullName,
            userImageUrl: currentUser.imageUrl,
            dateCreate: reply.createdAt,
        };
        io.to(`commentByTrainingPart${comment.trainingPart._id}`).emit('newReply', replyResponse);
        return replyResponse;
       
    } catch (error) {
      console.error(error);
        throw new Error( 'Có lỗi khi thêm phản hồi');
    }
  };

