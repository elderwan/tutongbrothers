# 🚀 Vercel 部署问题解决方案

## ❌ 问题：404 NOT_FOUND

**错误信息**:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: sin1::44ksb-1761120611205-4bbf2f18600e
```

---

## 🔍 原因分析

### 根本原因
Next.js App Router 项目缺少根路由文件 `app/page.tsx`。

### 项目结构
```
app/
  ├── layout.tsx       ✅ 存在
  ├── page.tsx         ❌ 缺失！← 这是问题所在
  ├── homepage/
  │   └── page.tsx     ✅ 存在 (/homepage 路由)
  ├── blog/
  │   └── page.tsx     ✅ 存在 (/blog 路由)
  └── profile/
      └── page.tsx     ✅ 存在 (/profile 路由)
```

当用户访问 `https://你的域名.vercel.app/` 时，Next.js 找不到根路由处理器，返回 404。

---

## ✅ 已实施的解决方案

### 1. 创建根路由页面
**文件**: `client/app/page.tsx`

```typescript
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/homepage')
}
```

**作用**: 访问根路径 `/` 时自动重定向到 `/homepage`

---

### 2. 添加中间件重定向
**文件**: `client/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 如果访问根路径，重定向到 /homepage
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/homepage', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
```

**作用**: 在服务器层面处理重定向，更高效

---

### 3. 创建 Vercel 配置文件
**文件**: `client/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/",
      "destination": "/homepage"
    }
  ],
  "regions": ["sin1"]
}
```

**作用**: 
- 确保 Vercel 正确识别 Next.js 项目
- 配置 URL 重写规则
- 指定部署区域（新加坡，更近中国）

---

## 🚀 重新部署

### 方法 1: 使用 Vercel CLI

```bash
cd client
vercel --prod
```

### 方法 2: Git 推送自动部署

```bash
git add .
git commit -m "Fix: Add root route and middleware for Vercel deployment"
git push
```

Vercel 会自动检测 GitHub 推送并重新部署。

---

## 🔧 配置环境变量

### 在 Vercel Dashboard 设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 生产环境标识 |
| `NEXT_PUBLIC_API_BASE_URL` | `https://tutongbrothers.onrender.com/api` | 后端 API 地址 |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dewxaup4t` | Cloudinary 配置 |

⚠️ **重要**: 添加环境变量后需要触发重新部署才能生效。

---

## 📋 部署后验证清单

### 1. 检查路由
- [ ] 访问 `https://你的域名.vercel.app/` → 应该重定向到 `/homepage`
- [ ] 访问 `/homepage` → 显示主页
- [ ] 访问 `/blog` → 显示博客列表
- [ ] 访问 `/profile` → 显示个人资料

### 2. 检查功能
- [ ] 页面正常加载，无 404 错误
- [ ] 图片正常显示（Cloudinary）
- [ ] API 请求正常（连接后端）
- [ ] 动画效果正常

### 3. 检查性能
- [ ] 首次加载时间 < 3 秒
- [ ] Lighthouse 分数 > 80
- [ ] 无控制台错误

---

## 🐛 常见问题排查

### Q1: 重新部署后仍然 404
**解决**:
1. 清除浏览器缓存（Ctrl + Shift + R）
2. 在 Vercel Dashboard 检查部署状态
3. 查看部署日志确认构建成功
4. 确认 `app/page.tsx` 文件已提交到 Git

### Q2: 环境变量未生效
**解决**:
1. 确认变量名拼写正确
2. `NEXT_PUBLIC_*` 变量需要重新构建才能生效
3. 在 Vercel Dashboard 触发 **Redeploy**

### Q3: 重定向循环
**解决**:
1. 检查 `middleware.ts` 中的 matcher 配置
2. 确保只在根路径 `/` 执行重定向
3. 检查 `app/page.tsx` 没有重复重定向

### Q4: 图片加载失败
**解决**:
1. 检查 `next.config.ts` 中的 `remotePatterns` 配置
2. 确认 Cloudinary URL 正确
3. 验证图片 URL 格式

---

## 📊 Vercel 部署最佳实践

### 1. 项目结构
```
client/
  ├── app/
  │   ├── page.tsx           ✅ 根路由（必需）
  │   ├── layout.tsx         ✅ 根布局
  │   └── [feature]/
  │       └── page.tsx       ✅ 功能页面
  ├── middleware.ts          ✅ 中间件（可选）
  ├── vercel.json            ✅ Vercel 配置（可选）
  └── next.config.ts         ✅ Next.js 配置
```

### 2. 路由规范
- ✅ 使用 App Router（`app/` 目录）
- ✅ 每个路由必须有 `page.tsx` 文件
- ✅ 根路径必须有 `app/page.tsx`
- ✅ 动态路由使用 `[param]` 文件夹

### 3. 性能优化
- ✅ 使用 `next/image` 组件优化图片
- ✅ 启用静态生成（SSG）适用页面
- ✅ 使用 `loading.tsx` 添加加载状态
- ✅ 合理使用 `use client` 指令

### 4. SEO 优化
- ✅ 在 `layout.tsx` 添加 `metadata`
- ✅ 每个页面设置独立的 `metadata`
- ✅ 使用语义化 HTML
- ✅ 添加 Open Graph 标签

---

## 🔗 有用的链接

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel 文档](https://vercel.com/docs)
- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [部署日志查看](https://vercel.com/elderwan/tutongbrothers/deployments)

---

## 📞 获取帮助

如果问题仍未解决：

1. **查看部署日志**
   - Vercel Dashboard → 你的项目 → Deployments → 点击最新部署 → Logs

2. **本地测试**
   ```bash
   cd client
   npm run build
   npm run start
   # 访问 http://localhost:3000
   ```

3. **检查 Vercel 状态**
   - [Vercel Status Page](https://www.vercel-status.com/)

4. **联系支持**
   - Vercel Discord: https://vercel.com/discord
   - GitHub Issues: https://github.com/vercel/next.js/issues

---

**最后更新**: 2025-10-22  
**状态**: ✅ 已修复 - 添加根路由和重定向配置
**部署区域**: sin1（新加坡）
