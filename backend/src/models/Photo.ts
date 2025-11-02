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

// 添加索引优化查询性能
PhotoSchema.index({ order: 1, createdAt: -1 }); // 按顺序和创建时间排序

export default mongoose.model<IPhoto>('Photo', PhotoSchema);
