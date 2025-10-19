import mongoose, { Schema, Document } from "mongoose";

export interface IReplyComment extends Document {
    parentId: mongoose.Types.ObjectId; // 主评论ID
    sendUserId: mongoose.Types.ObjectId; // 发送者用户ID
    senderName: string; // 发送者用户名称
    senderImg: string; // 发送者用户头像
    receiveUserId: mongoose.Types.ObjectId; // 接收者用户ID
    receiverName: string; // 接收者用户名称
    receiverImg: string; // 接收者用户头像
    content: string; // 回复内容
    createdAt: Date;
    updatedAt: Date;
}

const replyCommentSchema: Schema = new Schema({
    parentId: { type: Schema.Types.ObjectId, ref: 'maincomments', required: true },
    sendUserId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    senderName: { type: String, required: true },
    senderImg: { type: String, required: true },
    receiveUserId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    receiverName: { type: String, required: true },
    receiverImg: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IReplyComment>("replycomments", replyCommentSchema);