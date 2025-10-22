import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notificationController";
import ApiResponse from "../utils/Response";

import rateLimit from "express-rate-limit";

const router: Router = Router();

const notificationLimiter = rateLimit({
    windowMs: 2 * 1000, // 2秒
    max: 5,             // 最多5次请求
    message: (req: any, res: any) => res.status(429).json(ApiResponse.tooManyRequests("Too many notification requests, please slow down")),
    keyGenerator: (req) => `${req.body.userId || req.body.sendUserId}-notification`
});

router.get("/", verifyToken, getNotifications);
router.post("/:id/read", verifyToken, notificationLimiter, markNotificationRead);
router.post("/read-all", verifyToken, notificationLimiter, markAllNotificationsRead);

export default router;