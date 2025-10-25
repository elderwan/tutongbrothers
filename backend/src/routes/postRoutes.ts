import { Router } from "express";
import {
    createPost,
    getPosts,
    getPostById,
    deletePost,
    toggleLikePost,
    addCommentToPost,
    getUserPosts
} from "../controllers/postController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// Create post (requires auth)
router.post("/", verifyToken, createPost);

// Get all posts
router.get("/", getPosts);

// Get post by ID
router.get("/:id", getPostById);

// Delete post (requires auth)
router.delete("/:id", verifyToken, deletePost);

// Toggle like on post (requires auth)
router.post("/:id/like", verifyToken, toggleLikePost);

// Add comment to post (requires auth)
router.post("/:id/comment", verifyToken, addCommentToPost);

// Get user's posts
router.get("/user/:userId", getUserPosts);

export default router;
