import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { followUser, unfollowUser, getFollowStatus } from "../controllers/followController";
import {
    getUserProfile,
    getUserById,
    updateUserProfile,
    updateUserAvatar,
    updateUserBanner,
    updateUserPassword,
    getFollowers,
    getFollowing,
    checkUsernameAvailable,
    checkEmailAvailable
} from "../controllers/userController";

const router: Router = Router();

// ==================== 用户资料管理 ====================

// 检查类路由（最具体的路径应放最上面）
router.get("/check-username", verifyToken, checkUsernameAvailable);
router.get("/check-email", verifyToken, checkEmailAvailable);

// 获取当前用户资料（固定路径，放在动态参数之前）
router.get("/profile", verifyToken, getUserProfile);

// 获取指定用户资料（动态参数）
router.get("/profile/:userId", verifyToken, getUserProfile);

// 更新用户资料
router.put("/profile", verifyToken, updateUserProfile);

// 更新用户头像
router.put("/avatar", verifyToken, updateUserAvatar);

// 更新用户背景图
router.put("/banner", verifyToken, updateUserBanner);

// 更新用户密码
router.put("/password", verifyToken, updateUserPassword);


// ==================== 关注功能 ====================

// 获取关注者列表（当前用户）
router.get("/followers", verifyToken, getFollowers);

// 获取关注者列表（指定用户）
router.get("/:userId/followers", getFollowers);

// 获取关注中列表（当前用户）
router.get("/following", verifyToken, getFollowing);

// 获取关注中列表（指定用户）
router.get("/:userId/following", getFollowing);

// 关注用户
router.post("/:targetUserId/follow", verifyToken, followUser);

// 取消关注
router.post("/:targetUserId/unfollow", verifyToken, unfollowUser);

// 获取关注状态
router.get("/:targetUserId/follow-status", verifyToken, getFollowStatus);


// ==================== 用户获取（最后放，因为是最泛的匹配） ====================

// 获取指定用户（必须放最后，否则会误判前面路径）
router.get("/:userId", getUserById);


export default router;