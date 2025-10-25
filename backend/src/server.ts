// 必须在所有导入之前加载环境变量
import dotenv from "dotenv";

// 根据 NODE_ENV 加载对应的环境配置文件
const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

dotenv.config({ path: envFile });

// 如果环境变量文件不存在，尝试加载默认 .env
if (!process.env.MONGO_URI) {
    dotenv.config();
}

import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";
import { config, validateConfig, printConfig } from "./config/env";
// import todoRoutes from "./routes/todoRoutes";
import loginRoutes from "./routes/loginRoutes";
import blogRoutes from "./routes/blogRoutes";
import postRoutes from "./routes/postRoutes";
import techStackRoutes from "./routes/techStackRoutes";
import commentRoutes from "./routes/commentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import photoRoutes from "./routes/photoRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes";

// 验证配置
try {
    validateConfig();
    printConfig();
} catch (error) {
    console.error(error);
    process.exit(1);
}

// 连接数据库
connectDB();

const app: Application = express();

// 中间件
app.use(cors({
    origin: config.clientUrl,
    credentials: true,
}));
app.use(express.json());

// 路由
// app.use("/api/todos", todoRoutes);
app.use("/api/users", loginRoutes, userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tech-stack", techStackRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/photos", photoRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// 启动服务
const httpServer = createServer(app);

// 集成 Socket.IO 并配置 CORS（允许前端域名）
const io = new Server(httpServer, {
    cors: {
        origin: config.clientUrl,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// 统一事件与房间管理：进入博客详情时加入对应房间，离开时退出
io.on("connection", (socket) => {
    socket.on("comment:join", ({ blogId }: { blogId: string }) => {
        if (blogId) {
            socket.join(`blog:${blogId}`);
        }
    });

    socket.on("comment:leave", ({ blogId }: { blogId: string }) => {
        if (blogId) {
            socket.leave(`blog:${blogId}`);
        }
    });
});

// 将 io 挂载到 app，供控制器中使用
(app as any).set("io", io);

httpServer.listen(config.port, () => {
    console.log(`\n🚀 Server running on http://localhost:${config.port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🌐 Client URL: ${config.clientUrl}\n`);
});
