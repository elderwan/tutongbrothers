import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    addComment,
    getBlogTypes
} from '../controllers/blogController';
import { verifyToken } from '../middleware/authMiddleware';
import ApiResponse from "../utils/Response";

const router: Router = Router();

const likeLimiter = rateLimit({
    windowMs: 1000, // 1秒
    max: 1,         // 1次请求
    //return json object
    message: (req: any, res: any) => res.status(429).json(ApiResponse.tooManyRequests("Too many like requests, please slow down")),
    keyGenerator: (req) => `${req.body.userId}-${req.params.id}`
});

// 创建博客 - 需要JWT验证
router.post("/", verifyToken, createBlog);

// 获取博客列表（支持搜索和筛选）
router.get("/", getBlogs);

// 获取博客类型列表
router.get("/types", getBlogTypes);

// 根据ID获取博客
router.get("/:id", getBlogById);

// 更新博客 - 需要JWT验证
router.put("/:id", verifyToken, updateBlog);

// 删除博客 - 需要JWT验证
router.delete("/:id", verifyToken, deleteBlog);

// 点赞博客 - 需要JWT验证
router.post("/:id/like", verifyToken, likeLimiter, likeBlog);

// 添加评论 - 需要JWT验证
router.post("/:id/comment", verifyToken, addComment);

export default router;