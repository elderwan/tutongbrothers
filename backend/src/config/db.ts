import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: "tutongbrothers"
        });

        // mongoose.set("debug", false);
        mongoose.set("debug", process.env.NODE_ENV !== "production");
        console.log("MongoDB connection successful. Name:", mongoose.connection.name);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
