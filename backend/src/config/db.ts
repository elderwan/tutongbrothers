import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        // 检查环境变量是否存在
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("❌ MONGO_URI is not defined in environment variables!");
            console.error("Available env vars:", Object.keys(process.env).filter(key => !key.includes('PASSWORD')));
            throw new Error("MONGO_URI environment variable is required");
        }

        console.log("🔄 Connecting to MongoDB...");
        console.log("📍 Environment:", process.env.NODE_ENV || "development");

        const conn = await mongoose.connect(mongoUri, {
            dbName: "tutongbrothers"
        });

        mongoose.set("debug", process.env.NODE_ENV !== "production");
        console.log("✅ MongoDB connection successful!");
        console.log("📦 Database Name:", mongoose.connection.name);
        console.log("🌐 MongoDB Host:", conn.connection.host);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
