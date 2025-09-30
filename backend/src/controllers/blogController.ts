import { Request, Response } from "express";
import Blog, { IBlog, IComment } from "../models/Blog";
import User from "../models/User";
import ApiResponse from "../utils/Response";

// 创建博客
export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        // 从JWT中获取用户ID
        const loggedInUserId = req.user.id;

        const { content, type, title, images } = req.body;

        // 验证必需字段 
        if (!title || !content || !type) {
            res.status(400).json(ApiResponse.badRequest("Title, content, and type are required"));
            return;
        }

        // 查找用户信息 - 使用JWT中的用户ID
        const user = await User.findById(loggedInUserId);
        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        // 创建博客 - 使用JWT中的用户ID
        const newBlog = new Blog({
            title,
            content,
            userId: loggedInUserId,
            userName: user.userName,
            userImg: user.userImg,
            type,
            images: images || []
        });

        await newBlog.save();

        res.status(201).json(ApiResponse.success("Blog created successfully", 201, newBlog));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to create blog"));
    }
};

// 获取博客列表（支持搜索和筛选）
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, type, sortBy } = req.query;

        // 构建查询条件
        const query: any = {};

        // 搜索条件
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // 类型筛选
        if (type && type !== 'all') {
            query.type = type;
        }

        // 排序条件
        let sort: any = { createdAt: -1 }; // 默认按创建时间倒序
        if (sortBy === 'oldest') {
            sort = { createdAt: 1 };
        } else if (sortBy === 'latest') {
            sort = { createdAt: -1 };
        }
        // else if (sortBy === 'popular') {
        //     // 按点赞数排序的逻辑需要在应用层处理，因为MongoDB不支持直接按数组长度排序
        //     // 这里我们仍然按创建时间排序
        //     sort = { likes: -1 };
        // }

        // 分页
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // 查询博客
        const blogs = await Blog.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'userName userImg');

        // 获取总数
        const total = await Blog.countDocuments(query);

        res.status(200).json(ApiResponse.success("Blogs retrieved successfully", 200, {
            blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to retrieve blogs"));
    }
};

// 获取博客类型列表
export const getBlogTypes = async (req: Request, res: Response): Promise<void> => {
    try {
        // 获取所有不同的博客类型
        const types = await Blog.distinct('type');
        res.status(200).json(ApiResponse.success("Blog types retrieved successfully", 200, types));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to retrieve blog types"));
    }
};

// 根据ID获取博客
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id).populate('userId', 'userName userImg');
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Blog retrieved successfully", 200, blog));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to retrieve blog"));
    }
};

// 更新博客
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, content, type, images } = req.body;

        // 查找并更新博客
        const blog = await Blog.findByIdAndUpdate(
            id,
            { title, content, type, images },
            { new: true, runValidators: true }
        );

        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Blog updated successfully", 200, blog));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to update blog"));
    }
};

// 删除博客
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Blog deleted successfully", 200, null));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete blog"));
    }
};

// 点赞博客
export const likeBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            res.status(400).json(ApiResponse.badRequest("User ID is required"));
            return;
        }

        // 查找博客
        const blog = await Blog.findById(id);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 检查用户是否已经点赞
        const userIndex = blog.likes.indexOf(userId as any);
        if (userIndex > -1) {
            // 取消点赞
            blog.likes.splice(userIndex, 1);
        } else {
            // 点赞
            blog.likes.push(userId as any);
        }

        await blog.save();

        res.status(200).json(ApiResponse.success(
            userIndex > -1 ? "Blog unliked successfully" : "Blog liked successfully",
            200,
            { likesCount: blog.likes.length }
        ));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to like/unlike blog"));
    }
};

// 添加评论
export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { userId, content } = req.body;
        if (!userId || !content) {
            res.status(400).json(ApiResponse.badRequest("User ID and content are required"));
            return;
        }

        // 查找用户信息
        const user = await User.findById(userId);
        console.log("finding user..", user);
        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        // 查找博客
        const blog = await Blog.findById(id);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 添加评论
        const comment = {
            userId: userId,
            userName: user.userName,
            userImg: user.userImg,
            content,
            createdAt: new Date()
        };

        blog.comments.push(comment);
        await blog.save();
        
        res.status(201).json(ApiResponse.success("Comment added successfully", 201, comment));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to add comment"));
    }
};