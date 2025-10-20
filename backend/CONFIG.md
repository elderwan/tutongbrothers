# Backend 配置管理指南

## 📁 配置文件结构

```
backend/
├── .env                      # 当前使用的配置（被 git 忽略）
├── .env.development          # 开发环境配置
├── .env.production           # 生产环境配置
├── .env.example              # 配置示例文件
└── src/
    └── config/
        ├── env.ts            # 配置管理模块
        └── db.ts             # 数据库配置
```

## 🚀 快速切换环境

### **开发模式（Development）**

```bash
# 方式 1：使用 npm 脚本（推荐）
npm run dev

# 方式 2：手动设置环境变量
NODE_ENV=development npm run dev
```

**特点：**
- 自动加载 `.env.development` 配置
- 前端地址：`http://localhost:3000`
- 数据库调试开启
- 端口：5000

---

### **生产模式（Production）**

```bash
# 方式 1：使用 npm 脚本（推荐）
npm run build
npm start

# 方式 2：模拟生产环境开发
npm run dev:prod
```

**特点：**
- 自动加载 `.env.production` 配置
- 前端地址：`https://tutongbrothers.vercel.app`
- 数据库调试关闭
- 端口：10000（Render 会覆盖为动态端口）

---

## 📋 可用的 npm 脚本

| 命令 | 说明 | 环境 |
|------|------|------|
| `npm run dev` | 开发模式启动（热重载） | development |
| `npm run dev:prod` | 模拟生产环境开发 | production |
| `npm run build` | 编译 TypeScript | - |
| `npm start` | 生产模式启动 | production |
| `npm run start:dev` | 编译后以开发模式运行 | development |

---

## ⚙️ 环境变量说明

### **必需变量**

- `MONGO_URI`: MongoDB 数据库连接字符串
- `JWT_SECRET`: JWT 加密密钥（至少32位）

### **可选变量**

- `NODE_ENV`: 环境模式（development/production）
- `PORT`: 服务器端口（默认 5000）
- `CLIENT_URL`: 前端地址（用于 CORS）

---

## 🔧 配置优先级

```
环境变量 > .env.{环境} > .env > 默认值
```

例如：
1. Render 平台设置的 `MONGO_URI` 
2. `.env.production` 中的 `MONGO_URI`
3. `.env` 中的 `MONGO_URI`
4. 代码中的默认值

---

## 📝 部署到 Render

### **环境变量设置（Render Dashboard）**

在 Render → Environment 中设置：

```
MONGO_URI=你的MongoDB连接字符串
JWT_SECRET=你的强密钥
CLIENT_URL=https://tutongbrothers.vercel.app
NODE_ENV=production
```

### **构建配置**

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `./backend`

---

## 🔍 配置验证

启动时会自动验证配置并显示：

```
📋 Configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 Environment:  development
🔌 Port:         5000
🗄️  Database:     mongodb+srv://elderwan:****@...
🔐 JWT Secret:   ✅ Set
🌐 Client URL:   http://localhost:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⚠️ 安全提示

### ✅ **安全做法**

- `.env.development` 和 `.env.production` 可以提交到 Git（但不要包含真实密码）
- 真实的敏感信息放在 `.env.local`（会被 git 忽略）
- 生产环境密钥与开发环境不同

### ❌ **不要做**

- 不要在代码中硬编码密码
- 不要将 `.env` 文件提交到 Git
- 不要在公开仓库暴露数据库连接字符串

---

## 🎯 示例使用场景

### **场景 1：本地开发**

```bash
# 1. 复制示例配置
cp .env.example .env

# 2. 编辑 .env 填入本地配置
# 3. 启动开发服务器
npm run dev
```

### **场景 2：测试生产环境**

```bash
# 使用生产环境配置进行本地测试
npm run dev:prod
```

### **场景 3：切换数据库**

编辑 `.env.development`:
```env
# 使用本地 MongoDB
MONGO_URI=mongodb://localhost:27017/tutongbrothers

# 或使用测试数据库
MONGO_URI=mongodb+srv://...测试集群...
```

---

## 🐛 故障排查

### **问题：找不到环境变量**

**解决方案：**
1. 检查 `.env.development` 或 `.env.production` 是否存在
2. 确认文件中有 `MONGO_URI` 和 `JWT_SECRET`
3. 查看启动日志中的配置信息

### **问题：CORS 错误**

**解决方案：**
检查 `CLIENT_URL` 是否与前端地址匹配：
- 开发环境：`http://localhost:3000`
- 生产环境：`https://tutongbrothers.vercel.app`

---

## 📚 更多信息

- [dotenv 文档](https://github.com/motdotla/dotenv)
- [cross-env 文档](https://github.com/kentcdodds/cross-env)
- [Render 环境变量](https://render.com/docs/environment-variables)
