import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import ApiResponse from "../utils/Response";
import mongoose from "mongoose";

/**
 * Create a new post
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { title, content, images, mentions } = req.body;

        if (!content) {
            res.status(400).json(ApiResponse.badRequest("Content is required"));
            return;
        }

        if (images && images.length > 18) {
            res.status(400).json(ApiResponse.badRequest("Maximum 18 images allowed"));
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        // Create post
        const newPost = new Post({
            title: title || undefined,
            content,
            userId: user._id,
            userName: user.userName,
            userImg: user.userImg,
            images: images || [],
            mentions: mentions || [],
        });

        await newPost.save();

        // Send notifications to mentioned users
        if (mentions && mentions.length > 0) {
            // TODO: Implement notification system
            // For now, just log the mentions
            console.log(`User ${user.userName} mentioned:`, mentions);
        }

        res.status(200).json(ApiResponse.success("Post created", 200, {
            post: newPost
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to create post", error));
    }
};

/**
 * Get all posts (with pagination)
 */
export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.status(200).json(ApiResponse.success("Posts retrieved", 200, {
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get posts", error));
    }
};

/**
 * Get post by ID
 */
export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json(ApiResponse.notFound("Post not found"));
            return;
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.status(200).json(ApiResponse.success("Post retrieved", 200, { post }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get post", error));
    }
};

/**
 * Delete post
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json(ApiResponse.notFound("Post not found"));
            return;
        }

        if (post.userId.toString() !== userId) {
            res.status(403).json(ApiResponse.unauthorized("Not authorized to delete this post"));
            return;
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json(ApiResponse.success("Post deleted", 200, {}));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete post", error));
    }
};

/**
 * Like/Unlike post
 */
export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const post = await Post.findById(id);

        if (!post) {
            res.status(404).json(ApiResponse.notFound("Post not found"));
            return;
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const likeIndex = post.likes.findIndex(id => id.equals(userObjectId));

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(userObjectId);
        }

        await post.save();

        res.status(200).json(ApiResponse.success("Post like toggled", 200, {
            liked: likeIndex === -1,
            likesCount: post.likes.length
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to toggle like", error));
    }
};

/**
 * Get user's posts
 */
export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments({ userId });

        res.status(200).json(ApiResponse.success("User posts retrieved", 200, {
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get user posts", error));
    }
};
