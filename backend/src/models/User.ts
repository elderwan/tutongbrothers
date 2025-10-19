import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    account: string;
    userEmail: string;
    userName: string;
    password: string;
    createdAt: Date;
    userImg: string;
    userBanner: string; // 用户背景图
    userCode: number;
    useGoogle: boolean;
    userGoogleId: string;
    isDeleted: boolean;
    userDesc: string; // 用户个人描述
    // 新增：关注关系
    following: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
}

const userSchema: Schema = new Schema(
    {
        account: { type: String, required: true, unique: true },
        userEmail: { type: String, required: true, unique: true },
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userImg: { type: String, required: true },
        userBanner: { type: String, required: false, default: '' },
        userCode: { type: Number, required: true, unique: true },
        useGoogle: { type: Boolean, required: false, default: false },
        userGoogleId: { type: String, required: false },
        isDeleted: { type: Boolean, required: false, default: false },
        userDesc: { type: String, required: false, default: '' },
        // 新增：关注关系
        following: [{ type: Schema.Types.ObjectId, ref: 'users', default: [] }],
        followers: [{ type: Schema.Types.ObjectId, ref: 'users', default: [] }],
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("users", userSchema);
