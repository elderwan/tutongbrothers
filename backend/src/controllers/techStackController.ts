import { Request, Response } from "express";
import TechCategory from "../models/TechStack";
import ApiResponse from "../utils/Response";

// 获取所有技术栈数据
export const getTechStack = async (req: Request, res: Response): Promise<void> => {
    try {
        const techStack = await TechCategory.find({});
        res.status(200).json(ApiResponse.success("Tech stack retrieved successfully", 200, techStack));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to retrieve tech stack"));
    }
};

// 创建技术栈数据
export const createTechStack = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, items } = req.body;

        const newTechCategory = new TechCategory({
            category,
            items
        });

        await newTechCategory.save();
        res.status(200).json(ApiResponse.success("Tech stack created successfully", 200, newTechCategory));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to create tech stack"));
    }
};

// 更新技术栈数据
export const updateTechStack = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { category, items } = req.body;

        const updatedTechCategory = await TechCategory.findByIdAndUpdate(
            id,
            { category, items },
            { new: true, runValidators: true }
        );

        if (!updatedTechCategory) {
            res.status(404).json(ApiResponse.notFound("Tech stack not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Tech stack updated successfully", 200, updatedTechCategory));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to update tech stack"));
    }
};

// 删除技术栈数据
export const deleteTechStack = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const deletedTechCategory = await TechCategory.findByIdAndDelete(id);
        if (!deletedTechCategory) {
            res.status(404).json(ApiResponse.notFound("Tech stack not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Tech stack deleted successfully", 200, null));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to delete tech stack"));
    }
};