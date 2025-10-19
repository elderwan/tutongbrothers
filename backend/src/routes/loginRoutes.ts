import { Router } from "express";
import { login, signup } from '../controllers/userController'
import { verifyToken } from "../middleware/authMiddleware";
import { followUser, unfollowUser, getFollowStatus } from "../controllers/followController";
const router: Router = Router();

router.post("/login", login);
router.post("/signup", signup);

// 关注接口集成到 /api/users 路由下
router.post("/:targetUserId/follow", verifyToken, followUser);
router.post("/:targetUserId/unfollow", verifyToken, unfollowUser);
router.get("/:targetUserId/follow-status", verifyToken, getFollowStatus);

export default router;
