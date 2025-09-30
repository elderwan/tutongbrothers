import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // 假设你有 User 模型
import ApiResponse from "../utils/Response"; // 你的工具类路径
import { generateUserId } from "../utils/GenerateUserId";

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
            { expiresIn: "1h" }
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