import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
// import todoRoutes from "./routes/todoRoutes";
import loginRoutes from "./routes/loginRoutes";
import blogRoutes from "./routes/blogRoutes";
import techStackRoutes from "./routes/techStackRoutes";

dotenv.config();

// 连接数据库
connectDB();

const app: Application = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
// app.use("/api/todos", todoRoutes);
app.use("/api/users", loginRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tech-stack", techStackRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});


// 启动服务
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
