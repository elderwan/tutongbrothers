import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import ApiResponse from "../utils/Response";
import Notification from "../models/Notification";

export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const followerId = req.user.id as string; // 当前登录用户
    const { targetUserId } = req.params; // 目标用户

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      res.status(400).json(ApiResponse.badRequest("Invalid target user id"));
      return;
    }
    if (followerId === targetUserId) {
      res.status(400).json(ApiResponse.badRequest("Cannot follow yourself"));
      return;
    }

    const [follower, target] = await Promise.all([
      User.findById(followerId),
      User.findById(targetUserId),
    ]);

    if (!follower || !target) {
      res.status(404).json(ApiResponse.notFound("User not found"));
      return;
    }

    // 已关注则直接返回
    if (follower.following?.some(id => id.equals(target.id))) {
      res.status(200).json(ApiResponse.success("Already following", 200, null));
      return;
    }

    follower.following = [...(follower.following || []), target.id];
    target.followers = [...(target.followers || []), follower.id];

    await Promise.all([follower.save(), target.save()]);

    // 创建关注通知
    await Notification.create({
      type: "follow",
      senderId: follower._id,
      receiverId: target._id,
      isRead: false,
      message: `${follower.userName} followed you`,
    });

    res.status(200).json(ApiResponse.success("Followed successfully", 200, null));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse.internalError("Failed to follow user"));
  }
};

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const followerId = req.user.id as string; // 当前登录用户
    const { targetUserId } = req.params; // 目标用户

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      res.status(400).json(ApiResponse.badRequest("Invalid target user id"));
      return;
    }
    if (followerId === targetUserId) {
      res.status(400).json(ApiResponse.badRequest("Cannot unfollow yourself"));
      return;
    }

    const [follower, target] = await Promise.all([
      User.findById(followerId),
      User.findById(targetUserId),
    ]);

    if (!follower || !target) {
      res.status(404).json(ApiResponse.notFound("User not found"));
      return;
    }

    // 过滤移除关系
    follower.following = (follower.following || []).filter(id => !id.equals(target.id));
    target.followers = (target.followers || []).filter(id => !id.equals(follower.id));

    await Promise.all([follower.save(), target.save()]);

    res.status(200).json(ApiResponse.success("Unfollowed successfully", 200, null));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse.internalError("Failed to unfollow user"));
  }
};

export const getFollowStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user.id as string;
    const { targetUserId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      res.status(400).json(ApiResponse.badRequest("Invalid target user id"));
      return;
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json(ApiResponse.notFound("User not found"));
      return;
    }

    const isFollowing = (currentUser.following || []).some(id => id.equals(new mongoose.Types.ObjectId(targetUserId)));

    res.status(200).json(ApiResponse.success("Follow status", 200, { isFollowing }));
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse.internalError("Failed to get follow status"));
  }
};