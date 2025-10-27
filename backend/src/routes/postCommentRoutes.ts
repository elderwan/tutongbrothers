import express from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
    getPostComments,
    getPostCommentsCount,
    addMainCommentToPost,
    addReplyCommentToPost,
    deleteMainCommentFromPost,
    deleteReplyCommentFromPost
} from "../controllers/postCommentController";

const router = express.Router();

// Get post comments with pagination
router.get("/post/:postId", getPostComments);

// Get post comments count
router.get("/post/countComments/:postId", getPostCommentsCount);

// Add main comment to post
router.post("/post/:postId/main", verifyToken, addMainCommentToPost);

// Add reply comment to main comment
router.post("/post/main/:parentId/reply", verifyToken, addReplyCommentToPost);

// Delete main comment
router.delete("/post/main/:commentId", verifyToken, deleteMainCommentFromPost);

// Delete reply comment
router.delete("/post/reply/:replyId", verifyToken, deleteReplyCommentFromPost);

export default router;
