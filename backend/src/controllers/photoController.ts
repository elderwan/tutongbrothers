import { Request, Response } from 'express';
import Photo from '../models/Photo';

// 获取所有照片（按顺序）
export const getPhotos = async (req: Request, res: Response) => {
    try {
        // 添加缓存头，减少重复请求
        res.setHeader('Cache-Control', 'public, max-age=300'); // 5分钟缓存

        const photos = await Photo.find()
            .sort({ order: 1, createdAt: -1 })
            .lean(); // 使用 lean() 提高查询性能

        res.status(200).json({
            code: 200,
            msg: 'success',
            data: photos
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({
            code: 500,
            msg: 'Failed to fetch photos',
            data: null
        });
    }
};

// 上传照片（需要管理员权限）
export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const { url, isPortrait, order } = req.body;

        const photo = new Photo({
            url,
            isPortrait: isPortrait || false,
            order: order || 0
        });

        await photo.save();

        res.status(200).json({
            code: 200,
            msg: 'Photo uploaded successfully',
            data: photo
        });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({
            code: 500,
            msg: 'Failed to upload photo',
            data: null
        });
    }
};

// 更新照片信息（需要管理员权限）
export const updatePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { url, isPortrait, order } = req.body;

        const photo = await Photo.findByIdAndUpdate(
            id,
            { url, isPortrait, order },
            { new: true }
        );

        if (!photo) {
            return res.status(404).json({
                code: 404,
                msg: 'Photo not found',
                data: null
            });
        }

        res.status(200).json({
            code: 200,
            msg: 'Photo updated successfully',
            data: photo
        });
    } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).json({
            code: 500,
            msg: 'Failed to update photo',
            data: null
        });
    }
};

// 删除照片（需要管理员权限）
export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const photo = await Photo.findByIdAndDelete(id);

        if (!photo) {
            return res.status(404).json({
                code: 404,
                msg: 'Photo not found',
                data: null
            });
        }

        res.status(200).json({
            code: 200,
            msg: 'Photo deleted successfully',
            data: null
        });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({
            code: 500,
            msg: 'Failed to delete photo',
            data: null
        });
    }
};
