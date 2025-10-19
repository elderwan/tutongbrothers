import User from "../models/User"; // 假设你的User模型是这个

/**
 * Generate next user_code
 * - 6 digit number
 * - Starts from 100000
 */
export const generateUserId = async (): Promise<number> => {
    // 查找最新的 user_code
    const lastUser = await User.findOne().sort({ userCode: -1 }).select("userCode");

    if (!lastUser || !lastUser.userCode) {
        // 如果没有用户，从100000开始
        return 100000;
    }

    // 上一个用户ID + 1
    const nextId = lastUser.userCode + 1;

    return nextId;
};
