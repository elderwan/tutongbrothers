import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    account: string;
    userEmail: string;
    userName: string;
    password: string;
    createdAt: Date;
    userImg: string;
    userCode: number;
    useGoogle: boolean;
    userGoogleId: string;
    isDeleted: boolean;
}

const userSchema: Schema = new Schema(
    {
        account: { type: String, required: true, unique: true },
        userEmail: { type: String, required: true, unique: true },
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        userImg: { type: String, required: true },
        userCode: { type: Number, required: true, unique: true },
        useGoogle: { type: Boolean, required: false, default: false },
        userGoogleId: { type: String, required: false },
        isDeleted: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("users", userSchema);
