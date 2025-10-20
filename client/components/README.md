# 组件目录结构说明

此文档记录了组件重新分类整理后的目录结构和文件命名规范。

## 📁 目录结构

### 🔐 auth/ - 认证相关组件
- `signin.tsx` - 登录表单组件
- `signin-dialog.tsx` - 登录对话框组件 (原: comp-326.tsx)
- `signup-dialog.tsx` - 注册对话框组件 (原: comp-325.tsx)

### 🧭 navigation/ - 导航相关组件
- `header-navigation.tsx` - 主导航头部组件 (原: my-navi.tsx)
- `post-button.tsx` - 发布按钮组件 (原: navipostbutton.tsx)
- `team-switcher.tsx` - 团队切换器组件
- `user-menu.tsx` - 用户菜单组件
- `notification-menu.tsx` - 通知菜单组件

### 📝 forms/ - 表单相关组件
- `payment-selector.tsx` - 支付方式选择器 (原: comp-163.tsx)

### 💬 dialogs/ - 对话框和弹窗组件
- `alert-dialog-demo.tsx` - 警告对话框演示 (原: comp-313.tsx)
- `error-dialog.tsx` - 错误对话框组件
- `error-dialog-demo.tsx` - 错误对话框演示组件

### 🎨 layout/ - 布局相关组件
- `footer.tsx` - 页脚组件
- `avatar.tsx` - 头像组件

### 🖼️ media/ - 媒体展示组件
- `photo-carousel.tsx` - 照片轮播组件
- `tutong-details.tsx` - TuTong详情组件 (原: tutongdetails.tsx)

### 🧱 ui/ - 基础UI组件
- 保持原有shadcn/ui组件结构不变

## 🔄 文件命名规范

### 命名原则
1. **kebab-case** - 使用短横线分隔的小写命名
2. **语义化** - 文件名能够清晰表达组件功能
3. **分类明确** - 根据组件用途放在对应目录下

### 重命名映射
| 原文件名 | 新文件名 | 说明 |
|---------|----------|------|
| `comp-163.tsx` | `forms/payment-selector.tsx` | 支付方式选择器 |
| `comp-313.tsx` | `dialogs/alert-dialog-demo.tsx` | 警告对话框演示 |
| `comp-325.tsx` | `auth/signup-dialog.tsx` | 注册对话框 |
| `comp-326.tsx` | `auth/signin-dialog.tsx` | 登录对话框 |
| `my-navi.tsx` | `navigation/header-navigation.tsx` | 主导航头部 |
| `navipostbutton.tsx` | `navigation/post-button.tsx` | 发布按钮 |
| `tutongdetails.tsx` | `media/tutong-details.tsx` | TuTong详情页 |

## 📥 导入路径更新

### 应用层面
```tsx
// 更新前
import ErrorDialogDemo from "@/components/error-dialog-demo"
import PhotoCarousel from "@/components/photo-carousel"
import OriginUINavi from "@/components/my-navi"

// 更新后
import ErrorDialogDemo from "@/components/dialogs/error-dialog-demo"
import PhotoCarousel from "@/components/media/photo-carousel"
import OriginUINavi from "@/components/navigation/header-navigation"
```

### 组件内部
```tsx
// 更新前
import { useErrorDialog } from "@/components/error-dialog"
import NotificationMenu from "@/components/notification-menu"

// 更新后
import { useErrorDialog } from "@/components/dialogs/error-dialog"
import NotificationMenu from "@/components/navigation/notification-menu"
```

## ✨ 优化效果

1. **更好的可维护性** - 组件按功能分类，便于查找和维护
2. **清晰的代码结构** - 开发者能快速定位所需组件
3. **规范的命名** - 统一的命名规范提高代码可读性
4. **模块化设计** - 相关组件聚合在一起，便于复用和测试

---

*此文档由重构工具自动生成，记录于 2025-09-22*