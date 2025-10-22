import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
    url: string;
    isPortrait: boolean; // true: 竖屏(3:4), false: 横屏(4:3)
    order: number; // 显示顺序
    createdAt: Date;
    updatedAt: Date;
}

const PhotoSchema: Schema = new Schema({
    url: {
        type: String,
        required: true
    },
    isPortrait: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model<IPhoto>('Photo', PhotoSchema);
