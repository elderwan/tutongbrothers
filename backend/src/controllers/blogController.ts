import { Request, Response } from "express";
import Blog, { IBlog, IComment } from "../models/Blog";
import User from "../models/User";
import MainComment from "../models/MainComment";
import ReplyComment from "../models/ReplyComment";
import ApiResponse from "../utils/Response";
import { PipelineStage } from "mongoose";
import Notification from "../models/Notification";


// 创建博客
export const createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
        // 从JWT中获取用户ID
        const loggedInUserId = req.user.id;
        const { content, type, title, description, images } = req.body;

        // 验证必需字段 
        if (!title || !description || !content || !type) {
            res.status(400).json(ApiResponse.badRequest("Title, description, content, and type are required"));
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
            description,
            content,
            userId: loggedInUserId,
            userName: user.userName,
            userImg: user.userImg,
            type,
            images: images || []
        });

        await newBlog.save();

        // 创建新博客通知：通知作者的所有粉丝
        const followers = user.followers || [];
        if (followers.length > 0) {
            const notifications = followers.map(followerId => ({
                type: "new_blog",
                senderId: user._id,
                receiverId: followerId,
                blogId: newBlog._id,
                isRead: false,
                message: `${user.userName} published a new blog: ${title}`
            }));
            await Notification.insertMany(notifications);
        }

        res.status(201).json(ApiResponse.success("Blog created successfully", 201, newBlog));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to create blog"));
    }
};

// 获取博客列表（支持搜索和筛选）
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search,userId, type, sortBy } = req.query;

        // 构建查询条件
        const query: any = {};

        // 搜索条件 - 支持标题、内容和简介的模糊搜索
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
               

            ];
        }

        if (userId) { 
            query.$and = [
                {userId: userId as string}
            ]
        }

        // 类型筛选
        if (type && type !== 'all') {
            query.type = type;
        }

        // 分页
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        let blogs;
        let total;

        // 排序条件
        if (sortBy === 'popular') {
            // 按点赞数排序 - 使用聚合管道
            const pipeline: PipelineStage[] = [
                { $match: query },
                {
                    $addFields: {
                        likesCount: { $size: "$likes" }
                    }
                },
                { $sort: { likesCount: -1, createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $addFields: {
                        userId: {
                            $arrayElemAt: ['$userInfo', 0]
                        }
                    }
                },
                {
                    $project: {
                        userInfo: 0,
                        'userId.password': 0,
                        'userId.userEmail': 0,
                        'userId.account': 0,
                        'userId.userCode': 0,
                        'userId.useGoogle': 0,
                        'userId.isDeleted': 0,
                        'userId.createdAt': 0,
                        'userId.updatedAt': 0,
                        'userId.__v': 0
                    }
                }
            ];

            blogs = await Blog.aggregate(pipeline);
            total = await Blog.countDocuments(query);
        } else {
            // 其他排序方式
            let sort: any = { createdAt: -1 }; // 默认按创建时间倒序
            if (sortBy === 'oldest') {
                sort = { createdAt: 1 };
            } else if (sortBy === 'latest') {
                sort = { createdAt: -1 };
            }

            // 查询博客
            blogs = await Blog.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('userId', 'userName userImg');

            // 获取总数
            total = await Blog.countDocuments(query);
        }

        // 为每个博客添加评论总数
        const blogsWithCommentCount = await Promise.all(
            blogs.map(async (blog) => {
                const blogId = blog._id;
                
                // 查询主评论
                const mainComments = await MainComment.find({ blogId }).select('_id');
                const mainCommentIds = mainComments.map(comment => comment._id);
                
                // 查询回复评论
                const replyCount = mainCommentIds.length > 0 
                    ? await ReplyComment.countDocuments({ parentId: { $in: mainCommentIds } })
                    : 0;
                
                // 总评论数 = 主评论数 + 回复评论数
                const commentsCount = mainComments.length + replyCount;
                
                // 返回包含评论数的博客对象
                return {
                    ...blog.toObject ? blog.toObject() : blog,
                    commentsCount
                };
            })
        );

        res.status(200).json(ApiResponse.success("Blogs retrieved successfully", 200, {
            blogs: blogsWithCommentCount,
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

// 增加博客浏览量
export const incrementBlogViews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const viewerId = req.body.viewerId; // 可选，用于判断是否是博主自己

        const blog = await Blog.findById(id);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 如果提供了 viewerId，检查是否是博主本人
        if (viewerId && blog.userId.toString() === viewerId) {
            // 博主本人，不增加浏览量
            res.status(200).json(ApiResponse.success("View recorded (author)", 200, { 
                views: blog.views,
                incremented: false 
            }));
            return;
        }

        // 增加浏览量
        blog.views = (blog.views || 0) + 1;
        await blog.save();

        res.status(200).json(ApiResponse.success("View count incremented", 200, { 
            views: blog.views,
            incremented: true 
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to increment views"));
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
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("token unauthorized"));
            return;
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            res.status(404).json(ApiResponse.notFound("Blog not found"));
            return;
        }

        // 权限校验：仅作者可删除
        if (blog.userId.toString() !== userId) {
            res.status(403).json(ApiResponse.forbidden("You can only delete your own blogs"));
            return;
        }

        await Blog.findByIdAndDelete(id);

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
// export const addComment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const { userId, content, parentId } = req.body;
//         if (!userId || !content) {
//             res.status(400).json(ApiResponse.badRequest("User ID and content are required"));
//             return;
//         }

//         // 查找用户信息
//         const user = await User.findById(userId);
//         console.log("finding user..", user);
//         if (!user) {
//             res.status(404).json(ApiResponse.notFound("User not found"));
//             return;
//         }

//         // 查找博客
//         const blog = await Blog.findById(id);
//         if (!blog) {
//             res.status(404).json(ApiResponse.notFound("Blog not found"));
//             return;
//         }

//         // 创建评论对象
//         const comment = {
//             userId: userId,
//             userName: user.userName,
//             userImg: user.userImg,
//             content,
//             parentId: parentId || null,
//             replies: [],
//             createdAt: new Date()
//         };

//         if (parentId) {
//             // 如果是回复评论，找到父评论并添加到其replies数组中
//             const parentComment = blog.comments.id(parentId);
//             if (!parentComment) {
//                 res.status(404).json(ApiResponse.notFound("Parent comment not found"));
//                 return;
//             }
            
//             // 确保replies数组存在
//             if (!parentComment.replies) {
//                 parentComment.replies = [];
//             }
            
//             parentComment.replies.push(comment);
//         } else {
//             // 如果是顶级评论，直接添加到博客的comments数组中
//             blog.comments.push(comment);
//         }

//         await blog.save();
        
//         res.status(201).json(ApiResponse.success("Comment added successfully", 201, comment));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json(ApiResponse.internalError("Failed to add comment"));
//     }
// };