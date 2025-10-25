import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
    title?: string; // Optional post title
    content: string; // Post content (no limit on words)
    userId: mongoose.Types.ObjectId;
    userName: string;
    userImg: string;
    images: string[]; // Maximum 18 images
    likes: mongoose.Types.ObjectId[];
    comments: IPostComment[];
    mentions: mongoose.Types.ObjectId[]; // @mentioned user IDs
    createdAt: Date;
    updatedAt: Date;
    views: number;
}

export interface IPostComment {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    userName: string;
    userImg: string;
    content: string;
    parentId?: mongoose.Types.ObjectId;
    replies?: IPostComment[];
    createdAt: Date;
}

const postCommentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    userName: { type: String, required: true },
    userImg: { type: String, required: true },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, default: null },
    replies: [{ type: Schema.Types.Mixed }],
    createdAt: { type: Date, default: Date.now }
});

const postSchema: Schema = new Schema({
    title: { type: String },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    userName: { type: String, required: true },
    userImg: { type: String, required: true },
    images: {
        type: [String],
        validate: {
            validator: function (v: string[]) {
                return v.length <= 18;
            },
            message: 'Maximum 18 images allowed'
        }
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    comments: [postCommentSchema],
    mentions: [{ type: Schema.Types.ObjectId, ref: 'users' }], // @mentioned users
    views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model<IPost>("posts", postSchema);
