import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../controllers/notificationController";

const router: Router = Router();

router.get("/", verifyToken, getNotifications);
router.post("/:id/read", verifyToken, markNotificationRead);
router.post("/read-all", verifyToken, markAllNotificationsRead);

export default router;