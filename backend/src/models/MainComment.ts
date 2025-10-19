import mongoose, { Schema, Document } from "mongoose";

export interface IMainComment extends Document {
    blogId: mongoose.Types.ObjectId; // 所属博客ID
    userId: mongoose.Types.ObjectId; // 评论用户ID
    userName: string; // 评论用户名称
    userImg: string; // 评论用户头像
    content: string; // 评论内容
    createdAt: Date;
    updatedAt: Date;
}

const mainCommentSchema: Schema = new Schema({
    blogId: { type: Schema.Types.ObjectId, ref: 'blogs', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    userName: { type: String, required: true },
    userImg: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IMainComment>("maincomments", mainCommentSchema);