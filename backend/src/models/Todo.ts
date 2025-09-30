import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
    todo: string;
    completed: boolean;
    createdAt: Date;
    id: number;
    isDeleted: boolean;
    updatedAt: Date;
}

const todoSchema: Schema = new Schema(
    {
        todo: { type: String, required: true },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<ITodo>("todos", todoSchema);
