import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
// import todoRoutes from "./routes/todoRoutes";
import loginRoutes from "./routes/loginRoutes";
import blogRoutes from "./routes/blogRoutes";
import techStackRoutes from "./routes/techStackRoutes";
import commentRoutes from "./routes/commentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes";

dotenv.config();

// 连接数据库
connectDB();

const app: Application = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
// app.use("/api/todos", todoRoutes);
app.use("/api/users", loginRoutes, userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tech-stack", techStackRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// 启动服务
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// 集成 Socket.IO 并配置 CORS（允许前端域名）
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
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

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
