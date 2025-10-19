import mongoose, { Schema, Document } from "mongoose";

export type NotificationType = "reply" | "follow" | "new_blog";

export interface INotification extends Document {
  type: NotificationType;
  senderId: mongoose.Types.ObjectId; // 触发通知的用户
  receiverId: mongoose.Types.ObjectId; // 接收通知的用户
  blogId?: mongoose.Types.ObjectId; // 关联博客（回复/新博客）
  mainCommentId?: mongoose.Types.ObjectId; // 回复通知关联的主评论
  replyCommentId?: mongoose.Types.ObjectId; // 回复通知关联的子评论
  isRead: boolean;
  message?: string; // 可选消息摘要
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema = new Schema(
  {
    type: { type: String, enum: ["reply", "follow", "new_blog"], required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "blogs" },
    mainCommentId: { type: Schema.Types.ObjectId, ref: "maincomments" },
    replyCommentId: { type: Schema.Types.ObjectId, ref: "replycomments" },
    isRead: { type: Boolean, default: false },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("notifications", notificationSchema);