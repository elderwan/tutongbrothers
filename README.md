# 🐾 TutongBrothers Blog

一个基于 Next.js + Express + MongoDB 的全栈博客系统，采用 Beagle Design（宠物主题）设计风格。

## 📁 项目结构

```
tutongbrothers/
├── client/              💻 前端项目 (Next.js 15 + React 19)
│   ├── app/            📄 页面路由
│   ├── components/     🧩 React 组件
│   ├── types/          📝 TypeScript 类型定义
│   ├── api/            🔌 API 封装
│   ├── lib/            🛠️ 工具函数
│   ├── contexts/       🌐 React Context
│   └── public/         📦 静态资源
├── backend/            ⚙️ 后端项目 (Express + TypeScript)
│   ├── src/
│   │   ├── controllers/  🎮 控制器
│   │   ├── models/       💾 数据模型
│   │   ├── routes/       🛣️ 路由
│   │   ├── middleware/   🔒 中间件
│   │   └── config/       ⚙️ 配置文件
│   └── .env.example      📋 环境变量模板
└── docs/               📚 项目文档
    ├── deployment/     🚀 部署文档
    └── features/       ✨ 功能文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB >= 6.0

### 安装依赖

```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 配置环境变量

```bash
# 后端配置
cd backend
cp .env.example .env
# 编辑 .env 文件，填写实际配置

# 前端配置（如需要）
cd ../client
# Next.js 会自动使用 .env.local
```

### 启动开发服务器

```bash
# 启动后端（终端 1）
cd backend
npm run dev              # 开发环境
# 或
npm run dev:prod         # 生产环境配置

# 启动前端（终端 2）
cd client
npm run dev
```

访问：
- 前端：http://localhost:3000
- 后端：http://localhost:5000

## 🎨 主要功能

### 已实现功能
- ✅ 用户认证系统（JWT）
- ✅ 博客文章 CRUD
- ✅ Markdown 编辑器
- ✅ 评论系统（主评论+子评论）
- ✅ 用户关注系统
- ✅ 通知系统
- ✅ 照片墙（Cloudinary）
- ✅ 个人资料编辑
- ✅ 管理员权限
- ✅ 像素风格代码动画
- ✅ 响应式设计

### 技术栈展示
详见主页的 Tech Stack 卡片，包含：
- React + Next.js + Node.js + MongoDB
- Tailwind CSS + Framer Motion
- TypeScript + Express

## 📚 文档索引

### 部署文档
- [Render 部署指南](docs/deployment/RENDER_DEPLOYMENT.md)
- [Vercel 部署修复](docs/deployment/VERCEL_DEPLOYMENT_FIX.md)

### 功能文档
- [照片墙实现](docs/features/PHOTO_WALL_GUIDE.md)
- [主页动画指南](docs/features/HOMEPAGE_ANIMATION_GUIDE.md)
- [个人资料功能](docs/features/PROFILE_FEATURE_SUMMARY.md)
- [类型系统优化](docs/features/TYPE_SYSTEM_OPTIMIZATION.md)
- [更多文档...](docs/features/)

### 项目管理
- [项目清理报告](docs/PROJECT_CLEANUP_REPORT.md)

## 🛠️ 开发脚本

### 前端 (client/)
```bash
npm run dev          # 启动开发服务器（Turbopack）
npm run build        # 构建（本地，使用 Turbopack）
npm run build:prod   # 构建（生产，标准构建）
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 后端 (backend/)
```bash
npm run dev          # 开发环境（使用 .env.development）
npm run dev:prod     # 生产配置开发（使用 .env.production）
npm run build        # 编译 TypeScript
npm run start        # 启动生产服务器
```

## 🌐 部署

### Vercel（前端推荐）

```bash
cd client
vercel --prod
```

或者推送到 GitHub，Vercel 会自动部署。

### Render（后端推荐）

参考 [Render 部署指南](docs/deployment/RENDER_DEPLOYMENT.md)

## 🎨 设计系统

### Beagle Design - Pet Theme

**主色调**：
- 🟠 Warm Orange: `#FF8C00`
- 🟢 Forest Green: `#2D5016`
- 🟡 Cream: `#FFF8DC`
- 🟤 Light Beige: `#F5E6D3`

**特色**：
- 宠物友好的圆角设计
- 温暖的配色方案
- 像素风格编程符号动画
- 流畅的过渡动画

详见：[PET_THEME_SUMMARY.md](docs/features/PET_THEME_SUMMARY.md)

## 📦 核心依赖

### 前端
- Next.js 15.5.2
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- Framer Motion 12
- Axios 1.12.2

### 后端
- Express 4
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Bcrypt
- TypeScript 5
- Cloudinary (图片CDN)

## 🔒 环境变量

### 后端必需
```env
MONGODB_URI              # MongoDB 连接字符串
JWT_SECRET               # JWT 密钥
PORT                     # 服务器端口
FRONTEND_URL             # 前端地址（CORS）
CLOUDINARY_URL           # Cloudinary 配置
```

详见 `backend/.env.example`

## 🧹 项目维护

### 清理构建产物
```bash
# 使用清理脚本（Windows）
.\cleanup.ps1

# 或手动清理
cd client && rm -rf .next out
cd ../backend && rm -rf dist
```

### 更新依赖
```bash
# 检查过时依赖
npm outdated

# 更新依赖
npm update

# 审计安全漏洞
npm audit fix
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目仅供学习和个人使用。

## 📧 联系方式

- GitHub: [@elderwan](https://github.com/elderwan)
- 项目地址: [tutongbrothers](https://github.com/elderwan/tutongbrothers)

## 🎉 致谢

- Next.js 团队
- React 团队
- 所有开源贡献者

---

**最后更新**: 2025-10-22  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪
