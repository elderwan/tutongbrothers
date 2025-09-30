import mongoose, { Schema, Document } from "mongoose";

export interface ITechItem extends Document {
    label: string;
    imgLink: string;
    link: string;
}

export interface ITechCategory extends Document {
    category: string;
    items: ITechItem[];
}

const techItemSchema: Schema = new Schema({
    label: { type: String, required: true },
    imgLink: { type: String, required: true },
    link: { type: String, required: true }
});

const techCategorySchema: Schema = new Schema({
    category: { type: String, required: true },
    items: [techItemSchema]
});

export default mongoose.model<ITechCategory>("techstacks", techCategorySchema);