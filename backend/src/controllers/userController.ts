import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // 假设你有 User 模型
import ApiResponse from "../utils/Response"; // 你的工具类路径
import { generateUserId } from "../utils/GenerateUserId";
import mongoose from "mongoose";

export const login = async (req: Request, res: Response): Promise<void> => {

    try {
        const { emailOrAccount, password } = req.body;
        const user = await User.findOne({
            $or: [
                { userEmail: emailOrAccount },
                { account: emailOrAccount }
            ]
        });

        if (!user) {
            res.status(400).json(ApiResponse.badRequest("user not found"));
            return;
        }

        // 校验密码
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            res.status(401).json(ApiResponse.unauthorized("wrong password"));
            return;
        }

        // 生成 JWT
        const token = jwt.sign(
            { id: user._id, email: user.userEmail },
            process.env.JWT_SECRET || "SECRET",
            { expiresIn: "1w" }
        );

        // 返回成功
        res.status(200).json(
            ApiResponse.success("login success!", 200, {
                token,
                user: {
                    id: user._id,
                    userEmail: user.userEmail,
                    account: user.account,
                    userCode: user.userCode,
                    userName: user.userName,
                    userImg: user.userImg,
                    role: user.role,
                }
            })
        );

    } catch (err) {
        console.error(err);
        res.status(500).json(ApiResponse.internalError("server error!", err));
    }
};


//nomal sign up
export const signup = async (req: Request, res: Response): Promise<void> => {

    try {
        const { userEmail, account, password, userName } = req.body;
        //check the input is empty
        if (!userEmail || !account || !password || !userName) {
            res.json(ApiResponse.badRequest("Please fill in all fields"));
            return;
        }

        // 先检查用户是否存在
        const existingUser = await User.findOne({
            $or: [{ userEmail: userEmail }, { account: account }, { userName: userName }],
            isDeleted: { $ne: true }
        });
        if (existingUser) {
            res.json(ApiResponse.badRequest("Email, userName or account already exists"));
            return;
        }

        // 检查邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            res.json(ApiResponse.badRequest("Invalid email format"));
            return;
        }

        // check password format
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        // at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character
        if (!passwordRegex.test(password)) {
            res.json(ApiResponse.badRequest("Invalid password format"));
            return;
        }

        // 🔐 加密密码
        const saltRounds = 10; // 数字越大越安全，但越慢，一般10够用
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //generate userId
        const userCode = await generateUserId();

        // 保存用户
        const newUser = new User({

            userEmail,
            userName,
            account,
            userCode,
            password: hashedPassword,
            userImg: "https://res.cloudinary.com/dewxaup4t/image/upload/v1758264535/profile-user_vzeotq.png",
            useGoogle: false,
        });
        await newUser.save();

        res.json(ApiResponse.success("Signup successful", 201, {
            _id: newUser._id,
            userName: newUser.userName,
            userCode: newUser.userCode,
            account: newUser.account,
            userEmail: newUser.userEmail,
            userImg: newUser.userImg,
            useGoogle: newUser.useGoogle,
        }));
    } catch (error) {
        console.error(error);
        res.json(ApiResponse.internalError("Signup failed"));
    }

};

// ==================== 用户资料管理 ====================

/**
 * 获取用户资料（当前登录用户）
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        let { userId } = req.params;
        // 如果 params 没有或不是合法 ObjectId，就使用当前登录用户
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            userId = req.user?.id;
        }

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Profile retrieved", 200, {
            id: user._id,
            account: user.account,
            userEmail: user.userEmail,
            userName: user.userName,
            userImg: user.userImg,
            userCode: user.userCode,
            userDesc: user.userDesc || '',
            followingCount: user.following?.length || 0,
            followersCount: user.followers?.length || 0,
            createdAt: user.createdAt,
            userBanner: user.userBanner,
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get profile", error));
    }
};

/**
 * 获取指定用户资料（通过 userId）
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("User retrieved", 200, {
            id: user._id,
            account: user.account,
            userEmail: user.userEmail,
            userName: user.userName,
            userImg: user.userImg,
            userCode: user.userCode,
            userDesc: user.userDesc || '',
            followingCount: user.following?.length || 0,
            followersCount: user.followers?.length || 0,
            createdAt: user.createdAt,
            userBanner: user.userBanner,
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get user", error));
    }
};

/**
 * 更新用户资料
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { userName, userEmail, userDesc } = req.body;
        const updateData: any = {};

        // 检查 userName 唯一性
        if (userName) {
            const existingUser = await User.findOne({
                userName,
                _id: { $ne: userId },
                isDeleted: { $ne: true }
            });
            if (existingUser) {
                res.status(400).json(ApiResponse.badRequest("Username already taken"));
                return;
            }
            updateData.userName = userName;
        }

        // 检查 userEmail 唯一性
        if (userEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userEmail)) {
                res.status(400).json(ApiResponse.badRequest("Invalid email format"));
                return;
            }

            const existingUser = await User.findOne({
                userEmail,
                _id: { $ne: userId },
                isDeleted: { $ne: true }
            });
            if (existingUser) {
                res.status(400).json(ApiResponse.badRequest("Email already taken"));
                return;
            }
            updateData.userEmail = userEmail;
        }

        // userDesc 可以直接更新
        if (userDesc !== undefined) {
            updateData.userDesc = userDesc;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Profile updated", 200, {
            id: updatedUser._id,
            account: updatedUser.account,
            userEmail: updatedUser.userEmail,
            userName: updatedUser.userName,
            userImg: updatedUser.userImg,
            userCode: updatedUser.userCode,
            userDesc: updatedUser.userDesc || '',
            followingCount: updatedUser.following?.length || 0,
            followersCount: updatedUser.followers?.length || 0,
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to update profile", error));
    }
};

/**
 * 更新用户头像
 */
export const updateUserAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { userImg } = req.body;

        if (!userImg) {
            res.status(400).json(ApiResponse.badRequest("Image URL is required"));
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userImg },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Avatar updated", 200, {
            userImg: updatedUser.userImg
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to update avatar", error));
    }
};

/**
 * 更新用户背景图
 */
export const updateUserBanner = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { userBanner } = req.body;

        if (!userBanner) {
            res.status(400).json(ApiResponse.badRequest("Banner URL is required"));
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userBanner },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        res.status(200).json(ApiResponse.success("Banner updated", 200, {
            userBanner: updatedUser.userBanner
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to update banner", error));
    }
};

/**
 * 更新用户密码
 */
export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json(ApiResponse.unauthorized("Please login first"));
            return;
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json(ApiResponse.badRequest("Current and new password are required"));
            return;
        }

        // 验证密码格式
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json(ApiResponse.badRequest(
                "Password must be at least 6 characters with uppercase, lowercase, number and special character"
            ));
            return;
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        // 验证当前密码
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            res.status(401).json(ApiResponse.unauthorized("Current password is incorrect"));
            return;
        }

        // 加密新密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json(ApiResponse.success("Password updated successfully", 200, {}));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to update password", error));
    }
};

/**
 * 获取关注者列表
 */
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const targetUserId = req.params.userId || userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const user = await User.findById(targetUserId)
            .populate({
                path: 'followers',
                select: 'userName userImg userDesc',
                options: {
                    skip: (page - 1) * limit,
                    limit: limit
                }
            });

        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        const total = user.followers?.length || 0;

        res.status(200).json(ApiResponse.success("Followers retrieved", 200, {
            users: user.followers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get followers", error));
    }
};

/**
 * 获取关注中列表
 */
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const targetUserId = req.params.userId || userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const user = await User.findById(targetUserId)
            .populate({
                path: 'following',
                select: 'userName userImg userDesc',
                options: {
                    skip: (page - 1) * limit,
                    limit: limit
                }
            });

        if (!user) {
            res.status(404).json(ApiResponse.notFound("User not found"));
            return;
        }

        const total = user.following?.length || 0;

        res.status(200).json(ApiResponse.success("Following retrieved", 200, {
            users: user.following,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to get following", error));
    }
};

/**
 * 检查用户名是否可用
 */
export const checkUsernameAvailable = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { userName } = req.query;

        if (!userName) {
            res.status(400).json(ApiResponse.badRequest("Username is required"));
            return;
        }

        const existingUser = await User.findOne({
            userName: userName as string,
            _id: { $ne: userId },
            isDeleted: { $ne: true }
        });

        res.status(200).json(ApiResponse.success("Check complete", 200, {
            available: !existingUser
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to check username", error));
    }
};

/**
 * 检查邮箱是否可用
 */
export const checkEmailAvailable = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        const { email } = req.query;

        if (!email) {
            res.status(400).json(ApiResponse.badRequest("Email is required"));
            return;
        }

        const existingUser = await User.findOne({
            userEmail: email as string,
            _id: { $ne: userId },
            isDeleted: { $ne: true }
        });

        res.status(200).json(ApiResponse.success("Check complete", 200, {
            available: !existingUser
        }));
    } catch (error) {
        console.error(error);
        res.status(500).json(ApiResponse.internalError("Failed to check email", error));
    }
};