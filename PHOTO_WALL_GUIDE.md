# 照片墙功能使用指南

## 🎯 功能概述

### 1. **竖屏照片优化显示**
- 竖屏照片（3:4比例）会100%完整显示
- 左右空白区域自动填充模糊背景
- 横屏照片保持原有裁切填充方式

### 2. **点击查看大图**
- 点击照片可全屏查看
- 背景自动模糊化处理
- 点击背景或关闭按钮退出大图

### 3. **管理员照片管理**
- 管理员可以看到"管理照片墙"按钮
- 上传、删除照片
- 标记照片为竖屏/横屏
- 实时更新轮播图

### 4. **从本地照片迁移到数据库**
- 原本查询本地 `/photo/` 文件夹
- 现在查询数据库 `photos` 集合
- 支持动态管理，无需重新部署

---

## 🔧 配置步骤

### 步骤 1: 设置管理员角色

在 MongoDB 中找到您的用户，添加 `role: 'admin'` 字段：

```javascript
// 在 MongoDB Compass 或 mongosh 中执行
db.users.updateOne(
  { userEmail: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

或使用 mongosh 命令行：

```bash
mongosh "your-mongodb-connection-string"

use your-database-name

db.users.updateOne(
  { userEmail: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 步骤 2: 初始化照片数据

将现有照片迁移到数据库（如果需要）：

```javascript
// 在 MongoDB Compass 或 mongosh 中执行
db.photos.insertMany([
  {
    url: "/photo/tong1.jpg",
    isPortrait: false,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    url: "/photo/tong2.jpg",
    isPortrait: true,  // 竖屏照片
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    url: "/photo/tong3.jpg",
    isPortrait: false,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // ... 添加更多照片
])
```

### 步骤 3: 重启后端服务

```bash
cd backend
npm run dev
# 或
npm start
```

---

## 📖 使用方法

### 普通用户
1. 访问主页查看照片轮播
2. 点击照片查看大图
3. 使用左右箭头切换照片

### 管理员用户
1. 登录后访问主页
2. 看到"管理照片墙"按钮（普通用户看不到）
3. 点击按钮打开管理界面
4. 上传新照片：
   - 点击虚线框区域选择照片文件
   - 支持多选（可一次选择多张照片）
   - 照片会自动上传到 Cloudinary CDN
   - 勾选"竖屏照片"（如果是 3:4 比例）
   - 上传后自动保存到数据库
5. 删除照片：
   - 鼠标悬停在照片上
   - 点击右上角红色垃圾桶图标

---

## 🎨 照片规格建议

### 横屏照片
- 推荐比例: 4:3 或 16:9
- 推荐尺寸: 1920x1080px 或更高
- 文件大小: 最大 10MB
- 会被裁切填充容器

### 竖屏照片
- 推荐比例: 3:4
- 推荐尺寸: 1080x1440px 或更高
- 文件大小: 最大 10MB
- 会完整显示，不裁切

---

## ☁️ Cloudinary 配置

照片上传使用 Cloudinary CDN，配置文件位于 `client/lib/uploadImage.ts`：

```typescript
const CLOUDINARY_UPLOAD_PRESET = "blog_images";
const CLOUDINARY_CLOUD_NAME = "dewxaup4t";
```

如需修改配置：
1. 在 Cloudinary 控制台创建 Upload Preset
2. 更新 `uploadImage.ts` 中的配置
3. 重启前端服务

---

## 🔐 API 端点

### 公开端点
- `GET /api/photos` - 获取所有照片

### 管理员端点（需要 token）
- `POST /api/photos` - 上传照片
- `PUT /api/photos/:id` - 更新照片
- `DELETE /api/photos/:id` - 删除照片

---

## 🐛 故障排查

### 问题：看不到"管理照片墙"按钮
**解决方案：**
1. 确认已在数据库中设置 `role: 'admin'`
2. 退出登录后重新登录
3. 检查浏览器控制台是否有错误

### 问题：上传照片失败
**解决方案：**
1. 检查照片文件大小（不能超过 10MB）
2. 确认照片格式为常见图片格式（JPG、PNG、GIF 等）
3. 检查网络连接
4. 确认 Cloudinary 配置正确
5. 查看浏览器和后端控制台日志

### 问题：照片不显示
**解决方案：**
1. 检查 Cloudinary URL 是否正确
2. 确认照片已成功上传到 Cloudinary
3. 清空浏览器缓存重试
4. 检查网络是否可以访问 Cloudinary CDN

---

## 📝 数据模型

```typescript
interface Photo {
  _id: string;
  url: string;          // 照片URL，例如：/photo/example.jpg
  isPortrait: boolean;  // true: 竖屏(3:4), false: 横屏(4:3)
  order: number;        // 显示顺序
  createdAt: Date;      // 创建时间
  updatedAt: Date;      // 更新时间
}
```

```typescript
interface User {
  // ... 其他字段
  role: 'user' | 'admin';  // 用户角色
}
```

---

## ✨ 特性亮点

1. **智能显示** - 自动识别照片方向，优化显示效果
2. **毛玻璃效果** - 竖屏照片背景采用模糊处理，美观大方
3. **全屏浏览** - 支持点击放大，沉浸式查看
4. **Cloudinary CDN** - 照片托管在 Cloudinary，快速稳定
5. **实时管理** - 管理员可即时更新，无需重新部署
6. **权限控制** - 管理功能仅对管理员可见
7. **批量上传** - 支持一次选择多张照片上传
8. **响应式设计** - 移动端和桌面端都有良好体验

---

## 🚀 后续优化建议

1. ✅ ~~添加照片上传功能（直接上传文件而非输入 URL）~~ 已完成
2. 支持拖拽上传
3. 支持拖拽排序
4. 批量删除
5. 照片分类/标签
6. 自动图片压缩优化
7. 上传进度显示
