# 🚀 Render 部署指南

## 问题诊断

### 错误信息
```
==> Empty build command; skipping build
==> Publish directory build does not exist!
==> Build failed 😞
```

### 原因分析
1. **空构建命令**: Render 没有找到构建命令
2. **错误的输出目录**: Next.js 的输出是 `.next/` 不是 `build/`
3. **Turbopack 兼容性**: `--turbopack` 在某些环境可能不稳定

---

## 🔧 解决方案

### 方案 1: 使用 Render Dashboard（推荐）

#### Step 1: 创建 Web Service
1. 登录 [Render Dashboard](https://dashboard.render.com)
2. 点击 **New** → **Web Service**
3. 连接你的 GitHub 仓库 `elderwan/tutongbrothers`

#### Step 2: 配置服务

**基本设置**:
```yaml
Name: tutongbrothers-client
Region: Oregon (US West) 或 Singapore (更近中国)
Branch: master
Root Directory: client  # ⚠️ 重要：指定 client 子目录
```

**构建设置**:
```yaml
Runtime: Node
Build Command: npm install && npm run build:prod
Start Command: npm run start
```

**环境变量**:
```
NODE_ENV = production
NEXT_PUBLIC_API_BASE_URL = https://你的后端API地址.onrender.com
```

#### Step 3: 部署
点击 **Create Web Service**，Render 会自动开始构建和部署。

---

### 方案 2: 使用 render.yaml（自动化）

#### Step 1: 使用已创建的配置文件
项目根目录已有 `render.yaml` 文件。

#### Step 2: 修改配置（如需要）
```yaml
# render.yaml
services:
  - type: web
    name: tutongbrothers-client
    runtime: node
    region: oregon  # 或 singapore
    buildCommand: cd client && npm install && npm run build:prod
    startCommand: cd client && npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_API_BASE_URL
        sync: false  # 在 Dashboard 手动设置
```

#### Step 3: 推送到 GitHub
```bash
git add .
git commit -m "Add Render deployment config"
git push
```

#### Step 4: 在 Render 中连接
1. Dashboard → **New** → **Blueprint**
2. 选择仓库
3. Render 会自动读取 `render.yaml` 配置

---

## 📋 完整配置清单

### 1. Root Directory 配置

**如果项目结构是**:
```
blog/
  ├── client/          ← Next.js 前端
  │   ├── package.json
  │   ├── next.config.ts
  │   └── app/
  └── backend/         ← Express 后端
```

**则在 Render 中设置**:
```
Root Directory: client
```

### 2. Build Command

**选项 A: 标准构建（推荐）**
```bash
npm install && npm run build:prod
```

**选项 B: 使用 Turbopack**
```bash
npm install && npm run build
```

**选项 C: 清理缓存后构建**
```bash
npm install && rm -rf .next && npm run build:prod
```

### 3. Start Command
```bash
npm run start
```

### 4. 环境变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境标识 |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.example.com` | 后端 API 地址 |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary 配置 |

⚠️ **注意**: `NEXT_PUBLIC_` 开头的变量会被打包进前端代码，可以在客户端访问。

---

## 🔍 常见问题

### Q1: 构建失败 - "Cannot find module 'next'"
**原因**: 依赖未正确安装

**解决**:
```bash
# 在 Build Command 中添加
npm ci  # 使用 package-lock.json 精确安装
```

### Q2: 运行时错误 - "ENOENT: no such file or directory, open '.next/BUILD_ID'"
**原因**: 构建产物未生成

**解决**:
1. 检查 Build Command 是否正确执行
2. 查看构建日志确认 `.next/` 目录是否创建
3. 确认 `next.config.ts` 没有错误

### Q3: 环境变量未生效
**原因**: Next.js 需要在构建时读取 `NEXT_PUBLIC_*` 变量

**解决**:
1. 在 Render Dashboard 中设置环境变量
2. 触发重新构建（不是重启）
3. 使用 `console.log(process.env.NEXT_PUBLIC_API_BASE_URL)` 调试

### Q4: 页面加载慢或超时
**原因**: 免费计划会在 15 分钟无活动后休眠

**解决**:
- 升级到付费计划（$7/月起）
- 或使用其他服务如 Vercel（对 Next.js 更友好）

---

## 🌐 推荐的 Next.js 部署平台

### 1. **Vercel**（最推荐）
- ✅ Next.js 官方推荐
- ✅ 零配置自动部署
- ✅ 全球 CDN
- ✅ 自动优化
- ✅ 免费额度充足

**部署命令**:
```bash
npm install -g vercel
cd client
vercel --prod
```

### 2. **Render**（当前方案）
- ✅ 简单易用
- ✅ 支持多服务
- ⚠️ 免费计划会休眠
- ⚠️ 构建时间较长

### 3. **Netlify**
- ✅ 简单部署
- ✅ 良好的免费额度
- ⚠️ 需要配置 Netlify Functions 处理 API

---

## 📝 部署检查清单

构建前确认：
- [ ] `client/package.json` 中有 `build:prod` 脚本
- [ ] `client/next.config.ts` 配置正确
- [ ] 所有环境变量已设置
- [ ] `Root Directory` 指向 `client` 文件夹
- [ ] Build Command 使用 `npm run build:prod`
- [ ] Start Command 使用 `npm run start`

构建后验证：
- [ ] 构建日志无错误
- [ ] `.next/` 目录已生成
- [ ] 服务启动成功
- [ ] 网站可以访问
- [ ] API 请求正常
- [ ] 环境变量生效

---

## 🆘 获取帮助

如果仍然有问题：

1. **查看构建日志**
   - Render Dashboard → 你的服务 → Logs → Build Logs

2. **查看运行日志**
   - Render Dashboard → 你的服务 → Logs → Runtime Logs

3. **测试本地构建**
   ```bash
   cd client
   npm run build:prod
   npm run start
   # 访问 http://localhost:3000
   ```

4. **联系支持**
   - Render 支持：https://render.com/docs/support
   - Next.js 讨论：https://github.com/vercel/next.js/discussions

---

**最后更新**: 2025-10-22  
**状态**: ✅ 已配置 `build:prod` 脚本和 `render.yaml`
