import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
    addMainComment,
    addReplyComment,
    getBlogComments,
    deleteMainComment,
    deleteReplyComment,
    getBlogCommentsCount,
} from '../controllers/commentController';
import { verifyToken } from '../middleware/authMiddleware';
import ApiResponse from "../utils/Response";

const router: Router = Router();

// 评论限流器 - 防止刷评论
const commentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1分钟
    max: 10,             // 最多10条评论
    message: (req: any, res: any) => res.status(429).json(ApiResponse.tooManyRequests("Too many comment requests, please slow down")),
    keyGenerator: (req) => `${req.body.userId || req.body.sendUserId}-comment`
});

// 获取博客的所有评论（主评论 + 回复）
router.get("/blog/:blogId", getBlogComments);

router.get("/blog/countComments/:blogId", verifyToken, getBlogCommentsCount);

// 添加主评论 - 需要JWT验证
router.post("/blog/:blogId/main", verifyToken, commentLimiter, addMainComment);

// 添加回复评论 - 需要JWT验证
router.post("/main/:parentId/reply", verifyToken, commentLimiter, addReplyComment);

// 删除主评论 - 需要JWT验证
router.delete("/main/:commentId", verifyToken, deleteMainComment);

// 删除回复评论 - 需要JWT验证
router.delete("/reply/:replyId", verifyToken, deleteReplyComment);

export default router;