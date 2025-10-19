import mongoose, { Schema, Document } from "mongoose";


export interface IBlog extends Document {
    title: string;
    description: string; // Blog description/summary
    content: string;
    userId: mongoose.Types.ObjectId; // 引用User模型
    userName: string; // 用户名，方便显示
    userImg: string; // 用户头像
    type: string; // 博客类型
    images: string[]; // 博客图片URL数组
    likes: mongoose.Types.ObjectId[]; // 点赞用户ID数组
    comments: IComment[]; // 评论数组
    createdAt: Date;
    updatedAt: Date;
    views: number; // 浏览量
}

export interface IComment {
    _id?: mongoose.Types.ObjectId; // 添加 _id
    userId: mongoose.Types.ObjectId; // 评论用户ID
    userName: string; // 评论用户名称
    userImg: string; // 评论用户头像
    content: string; // 评论内容
    parentId?: mongoose.Types.ObjectId; // 父评论ID，用于回复功能
    replies?: IComment[]; // 子评论数组
    createdAt: Date;
}

const commentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    userName: { type: String, required: true },
    userImg: { type: String, required: true },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, default: null }, // 父评论ID，null表示顶级评论
    replies: [{ type: Schema.Types.Mixed }], // 子评论数组，使用Mixed类型以支持嵌套
    createdAt: { type: Date, default: Date.now }
});

const blogSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // Blog description/summary
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    userName: { type: String, required: true },
    userImg: { type: String, required: true },
    type: { type: String, required: true },
    images: [{ type: String }], // 图片URL数组
    likes: [{ type: Schema.Types.ObjectId, ref: 'users' }], // 点赞用户ID数组
    comments: [commentSchema], // 评论数组
    views: { type: Number, default: 0 } // 浏览量
}, { timestamps: true });

export default mongoose.model<IBlog>("blogs", blogSchema);