import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import loginRoutes from "./routes/loginRoutes";
import blogRoutes from "./routes/blogRoutes";
import techStackRoutes from "./routes/techStackRoutes";
import commentRoutes from "./routes/commentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

// 连接数据库（Serverless 环境需要缓存连接）
let isConnected = false;
async function ensureDbConnection() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}

const app: Application = express();

// 中间件
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(express.json());

// 数据库连接中间件
app.use(async (req, res, next) => {
    await ensureDbConnection();
    next();
});

// 路由
app.use("/api/users", loginRoutes, userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tech-stack", techStackRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Backend API is running on Vercel!");
});

app.get("/api", (req, res) => {
    res.json({
        message: "API is working",
        version: "1.0.0",
        endpoints: [
            "/api/users",
            "/api/blogs",
            "/api/tech-stack",
            "/api/comments",
            "/api/notifications"
        ]
    });
});

// Vercel Serverless 导出
export default app;

// 本地开发模式
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
