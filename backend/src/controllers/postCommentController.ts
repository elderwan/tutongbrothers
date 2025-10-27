import { Request, Response } from "express";
import MainComment from "../models/MainComment";
import ReplyComment from "../models/ReplyComment";
import Post from "../models/Post";
import User from "../models/User";
import ApiResponse from "../utils/Response";

/**
 * Get post comments with pagination
 */
export const getPostComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get main comments
        const mainComments = await MainComment.find({ postId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get reply comments for each main comment
        const commentsWithReplies = await Promise.all(
            mainComments.map(async (mainComment) => {
                const replies = await ReplyComment.find({ parentId: mainComment._id })
                    .sort({ createdAt: 1 }); // Replies in chronological order

                return {
                    _id: mainComment._id,
                    postId: mainComment.postId,
                    userId: mainComment.userId,
                    userName: mainComment.userName,
                    userImg: mainComment.userImg,
                    content: mainComment.content,
                    createdAt: mainComment.createdAt,
                    updatedAt: mainComment.updatedAt,
                    replies: replies.map(reply => ({
                        _id: reply._id,
                        parentId: reply.parentId,
                        sendUserId: reply.sendUserId,
                        senderName: reply.senderName,
                        senderImg: reply.senderImg,
                        receiveUserId: reply.receiveUserId,
                        receiverName: reply.receiverName,
                        receiverImg: reply.receiverImg,
                        content: reply.content,
                        createdAt: reply.createdAt,
                        updatedAt: reply.updatedAt,
                    }))
                };
            })
        );

        const total = await MainComment.countDocuments({ postId });

        res.status(200).json(ApiResponse.success("Comments retrieved", 200, {
            comments: commentsWithReplies,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get comments", error));
    }
};

/**
 * Get post comments count
 */
export const getPostCommentsCount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const mainCommentsCount = await MainComment.countDocuments({ postId });
        const replyCommentsCount = await ReplyComment.countDocuments({
            parentId: { $in: await MainComment.find({ postId }).distinct('_id') }
        });

        const total = mainCommentsCount + replyCommentsCount;

        res.status(200).json(ApiResponse.success("Comments count retrieved", 200, {
            total,
            mainComments: mainCommentsCount,
            replyComments: replyCommentsCount
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get comments count", error));
    }
};

/**
 * Add main comment to post
 */
export const addMainCommentToPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            res.status(400).json(ApiResponse.badRequest("Content is required"));
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json(ApiResponse.notFound("Post not found"));
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        const newComment = new MainComment({
            postId,
            userId: user._id,
            userName: user.userName,
            userImg: user.userImg,
            content
        });

        await newComment.save();

        res.status(200).json(ApiResponse.success("Comment added", 200, {
            _id: newComment._id,
            postId: newComment.postId,
            userId: newComment.userId,
            userName: newComment.userName,
            userImg: newComment.userImg,
            content: newComment.content,
            createdAt: newComment.createdAt,
            updatedAt: newComment.updatedAt,
            replies: []
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to add comment", error));
    }
};

/**
 * Add reply comment to main comment
 */
export const addReplyCommentToPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { parentId } = req.params;
        const { receiveUserId, content } = req.body;

        if (!content) {
            res.status(400).json(ApiResponse.badRequest("Content is required"));
            return;
        }

        if (!receiveUserId) {
            res.status(400).json(ApiResponse.badRequest("Receive user ID is required"));
            return;
        }

        const mainComment = await MainComment.findById(parentId);
        if (!mainComment) {
            res.status(404).json(ApiResponse.notFound("Main comment not found"));
            return;
        }

        const sendUser = await User.findById(userId);
        if (!sendUser) {
            res.status(404).json(ApiResponse.notFound("Sender not found"));
            return;
        }

        const receiveUser = await User.findById(receiveUserId);
        if (!receiveUser) {
            res.status(404).json(ApiResponse.notFound("Receiver not found"));
            return;
        }

        const newReply = new ReplyComment({
            parentId,
            sendUserId: sendUser._id,
            senderName: sendUser.userName,
            senderImg: sendUser.userImg,
            receiveUserId: receiveUser._id,
            receiverName: receiveUser.userName,
            receiverImg: receiveUser.userImg,
            content
        });

        await newReply.save();

        res.status(200).json(ApiResponse.success("Reply added", 200, {
            _id: newReply._id,
            parentId: newReply.parentId,
            sendUserId: newReply.sendUserId,
            senderName: newReply.senderName,
            senderImg: newReply.senderImg,
            receiveUserId: newReply.receiveUserId,
            receiverName: newReply.receiverName,
            receiverImg: newReply.receiverImg,
            content: newReply.content,
            createdAt: newReply.createdAt,
            updatedAt: newReply.updatedAt
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to add reply", error));
    }
};

/**
 * Delete main comment
 */
export const deleteMainCommentFromPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { commentId } = req.params;

        const comment = await MainComment.findById(commentId);
        if (!comment) {
            res.status(404).json(ApiResponse.notFound("Comment not found"));
            return;
        }

        if (comment.userId.toString() !== userId) {
            res.status(403).json(ApiResponse.forbidden("You can only delete your own comments"));
            return;
        }

        // Delete all replies
        await ReplyComment.deleteMany({ parentId: commentId });

        // Delete main comment
        await MainComment.findByIdAndDelete(commentId);

        res.status(200).json(ApiResponse.success("Comment deleted", 200, {}));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete comment", error));
    }
};

/**
 * Delete reply comment
 */
export const deleteReplyCommentFromPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { replyId } = req.params;

        const reply = await ReplyComment.findById(replyId);
        if (!reply) {
            res.status(404).json(ApiResponse.notFound("Reply not found"));
            return;
        }

        if (reply.sendUserId.toString() !== userId) {
            res.status(403).json(ApiResponse.forbidden("You can only delete your own replies"));
            return;
        }

        await ReplyComment.findByIdAndDelete(replyId);

        res.status(200).json(ApiResponse.success("Reply deleted", 200, {}));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete reply", error));
    }
};
