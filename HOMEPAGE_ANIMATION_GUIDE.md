# Homepage 首页三大模块滚动动画实现指南

## 📋 实现说明

本文档包含完整的首页代码，实现了：
1. **三大均分模块**：首屏欢迎、TutongBrothers介绍、开发者展示
2. **苹果风格滚动动画**：滚动时渐进播放动画效果
3. **Framer Motion**：使用 `useInView` Hook 检测元素进入视口

## 🎬 动画特点

- **Apple-style easing**: `[0.22, 1, 0.36, 1]` 缓动函数
- **渐进触发**: 滚动到模块20%时触发动画
- **只播放一次**: `once: true` 确保动画只在首次进入时播放
- **多元素错开**: `staggerChildren` 实现子元素依次出现

## 📦 所需依赖

```bash
npm install framer-motion
```

## 🔧 完整代码

由于文件较大，请按照以下步骤手动更新 `app/homepage/page.tsx`:

### 1. 导入部分

```typescript
"use client"
import Image from "next/image";
import Link from "next/link";
import PhotoCarousel from "@/components/media/photo-carousel";
import Avatar from '@/components/layout/avatar'
import { Button } from "@/components/ui/button"
import TechStack from "@/components/ui/tech-stack";
import { useState, useRef } from "react";
import Tutongdetails from "@/components/media/tutong-details";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import { Heart, Sparkles, Code2, Dog } from "lucide-react";
import { motion, useInView } from "framer-motion";
```

### 2. 组件状态和Refs

```typescript
export default function Home() {
  const { showSuccess } = useSuccessDialog();
  const [detailOpen, setDetailOpen] = useState(false);

  // Refs for scroll animations - 三大模块
  const module1Ref = useRef(null);
  const module2Ref = useRef(null);
  const module3Ref = useRef(null);

  // InView hooks for each module
  const module1InView = useInView(module1Ref, { once: true, amount: 0.2 });
  const module2InView = useInView(module2Ref, { once: true, amount: 0.2 });
  const module3InView = useInView(module3Ref, { once: true, amount: 0.2 });
```

### 3. 动画变量定义

```typescript
  // Animation variants - 苹果风格动画
  const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1] // Apple-style easing
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
```

### 4. 三大模块结构

#### 模块 1: 首屏欢迎 + Photo Carousel
- 使用 `motion.section` 包裹
- `ref={module1Ref}` 追踪滚动位置
- `min-h-screen` 占满一屏

#### 模块 2: TutongBrothers 社交媒体
- 独立的 `motion.section`
- 社交媒体卡片展示
- `min-h-screen` 居中展示

#### 模块 3: 开发者介绍
- 两栏布局
- 左侧：内容+技能
- 右侧：头像+装饰

## 📝 关键代码片段

### 检测滚动并触发动画

```typescript
<motion.section
  ref={module1Ref}
  initial="hidden"
  animate={module1InView ? "visible" : "hidden"}
  className="relative min-h-screen"
>
  {/* 内容 */}
</motion.section>
```

### 错开子元素动画

```typescript
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate={module1InView ? "visible" : "hidden"}
>
  <motion.div variants={fadeInUp}>元素1</motion.div>
  <motion.div variants={fadeInUp}>元素2</motion.div>
  <motion.div variants={fadeInUp}>元素3</motion.div>
</motion.div>
```

### 几何图形动画

```typescript
<motion.div
  initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
  animate={module1InView ? { opacity: 0.3, rotate: 45, scale: 1 } : {}}
  transition={{ duration: 1.5, delay: 0.3 }}
  className="absolute top-20 left-10 w-32 h-32 border-2 border-blue-200/30 rounded-3xl"
/>
```

## 🎨 视觉效果

1. **淡入上滑** (fadeInUp): 元素从下方80px淡入
2. **淡入** (fadeIn): 纯透明度变化
3. **缩放淡入** (scaleIn): 从92%放大到100%
4. **错开容器** (staggerContainer): 子元素依次出现，间隔0.15s

## 🚀 使用方法

1. 替换完整的 `app/homepage/page.tsx` 文件
2. 确保已安装 `framer-motion`
3. 刷新页面查看效果
4. 向下滚动观察每个模块的进入动画

## 💡 调整建议

### 调整触发时机
```typescript
// 元素进入视口更多时才触发
const module1InView = useInView(module1Ref, { once: true, amount: 0.5 });

// 允许重复播放
const module1InView = useInView(module1Ref, { once: false, amount: 0.2 });
```

### 调整动画速度
```typescript
const fadeInUp = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6, // 更快
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
```

### 调整错开间隔
```typescript
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // 增加间隔
      delayChildren: 0.3 // 增加初始延迟
    }
  }
};
```

## 📱 响应式适配

所有动画在移动端和桌面端都能正常工作。使用Tailwind的响应式类：
- `min-h-screen`: 保证每个模块至少占满一屏
- `md:` 前缀: 中等屏幕断点
- `lg:` 前缀: 大屏幕断点
- `2xl:` 前缀: 超大屏幕断点

## 🔍 调试技巧

1. 在浏览器DevTools中查看motion组件
2. 使用 `console.log(module1InView)` 检查视口状态
3. 临时移除 `once: true` 以便重复测试动画
4. 调整 `amount` 值观察不同触发时机

## ⚡ 性能优化

- ✅ `once: true` 避免重复计算
- ✅ 使用 `transform` 和 `opacity` (GPU加速)
- ✅ 避免在动画中使用 `width`/`height`
- ✅ 使用 `will-change` (Framer Motion自动处理)
