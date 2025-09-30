import { Router } from "express";
import {
    getTechStack,
    createTechStack,
    updateTechStack,
    deleteTechStack
} from '../controllers/techStackController';

const router: Router = Router();

// 获取所有技术栈数据
router.get("/", getTechStack);

// 创建技术栈数据
router.post("/", createTechStack);

// 更新技术栈数据
router.put("/:id", updateTechStack);

// 删除技术栈数据
router.delete("/:id", deleteTechStack);

export default router;