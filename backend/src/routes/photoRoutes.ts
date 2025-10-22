import express from 'express';
import {
    getPhotos,
    uploadPhoto,
    updatePhoto,
    deletePhoto
} from '../controllers/photoController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// 公开路由 - 获取所有照片
router.get('/', getPhotos);

// 管理员路由 - 需要认证和管理员权限
router.post('/', verifyToken, uploadPhoto);
router.put('/:id', verifyToken, updatePhoto);
router.delete('/:id', verifyToken, deletePhoto);

export default router;
