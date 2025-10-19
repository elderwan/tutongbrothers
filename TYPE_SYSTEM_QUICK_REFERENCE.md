# 类型系统快速参考指南
# Type System Quick Reference Guide

## 🎯 快速导入 (Quick Import)

### 单个类型导入
```typescript
import type { User } from '@/types';
import type { Blog } from '@/types';
import type { MainComment } from '@/types';
```

### 多个类型导入
```typescript
import type { 
  User, 
  Blog, 
  MainComment,
  UserProfile,
  BlogListResponse
} from '@/types';
```

### 导入枚举
```typescript
import { NotificationType } from '@/types';
```

## 📋 常用类型速查

### 用户相关 (User)
```typescript
// 基础用户
const user: User = {
  id: '123',
  userName: 'John',
  userImg: '/avatar.jpg',
  userEmail: 'john@example.com'
};

// 用户资料
const profile: UserProfile = {
  ...user,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02'
};

// 更新资料
const updateData: UpdateProfileRequest = {
  userName: 'New Name',
  userDesc: 'New bio'
};
```

### 博客相关 (Blog)
```typescript
// 博客文章
const blog: Blog = {
  _id: '123',
  title: 'My Blog',
  description: 'Description',
  content: 'Content',
  userId: 'user123',
  userName: 'John',
  userImg: '/avatar.jpg',
  type: 'tech',
  images: ['/img1.jpg'],
  likes: ['user1', 'user2'],
  comments: [],
  commentsCount: 5,
  views: 100,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02'
};

// 创建博客
const newBlog: CreateBlogRequest = {
  title: 'Title',
  description: 'Desc',
  content: 'Content',
  type: 'tech',
  images: []
};
```

### 评论相关 (Comment)
```typescript
// 主评论
const mainComment: MainComment = {
  _id: '123',
  blogId: 'blog123',
  userId: 'user123',
  userName: 'John',
  userImg: '/avatar.jpg',
  content: 'Nice post!',
  replies: [],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

// 回复评论
const reply: ReplyComment = {
  _id: '456',
  parentId: '123',
  blogId: 'blog123',
  senderId: 'user456',
  senderName: 'Jane',
  senderImg: '/jane.jpg',
  receiverId: 'user123',
  receiverName: 'John',
  receiverImg: '/john.jpg',
  content: 'Thanks!',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};
```

### 通知相关 (Notification)
```typescript
// 通知类型
import { NotificationType } from '@/types';

// 通知项
const notification: NotificationItem = {
  _id: '123',
  userId: 'user123',
  senderId: 'user456',
  senderName: 'Jane',
  senderImg: '/jane.jpg',
  type: NotificationType.LIKE,
  blogId: 'blog123',
  blogTitle: 'My Blog',
  content: 'Jane liked your blog',
  isRead: false,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};
```

### API 响应类型
```typescript
// 泛型 API 响应
const response: ApiResponse<Blog> = {
  code: 200,
  msg: 'Success',
  data: blog
};

// 博客列表响应
const blogList: BlogListResponse = {
  blogs: [blog1, blog2],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    pages: 10
  }
};

// 评论列表响应
const commentsList: CommentsResponse = {
  comments: [comment1, comment2],
  pagination: {
    page: 1,
    limit: 20,
    total: 50,
    pages: 3
  }
};
```

## 🔧 在组件中使用

### React 组件 Props
```typescript
import type { Blog, User } from '@/types';

interface BlogCardProps {
  blog: Blog;
  onLike?: (blogId: string) => void;
}

export function BlogCard({ blog, onLike }: BlogCardProps) {
  // Component logic
}
```

### useState
```typescript
import { useState } from 'react';
import type { User, Blog } from '@/types';

function MyComponent() {
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
}
```

### API 调用
```typescript
import { getBlogById } from '@/api/blog';
import type { Blog, ApiResponse } from '@/types';

async function fetchBlog(id: string) {
  const response: ApiResponse<Blog> = await getBlogById(id);
  
  if (response.code === 200) {
    const blog: Blog = response.data;
    console.log(blog.title);
  }
}
```

## 📦 类型工具 (Type Utilities)

### 部分类型 (Partial)
```typescript
// 更新时只需要部分字段
type PartialUser = Partial<User>;

const updateUser: PartialUser = {
  userName: 'New Name'
  // 其他字段可选
};
```

### 必需类型 (Required)
```typescript
// 所有字段必需
type RequiredUser = Required<User>;
```

### 选择字段 (Pick)
```typescript
// 只选择某些字段
type UserBasicInfo = Pick<User, 'id' | 'userName' | 'userImg'>;
```

### 排除字段 (Omit)
```typescript
// 排除某些字段
type UserWithoutEmail = Omit<User, 'userEmail'>;
```

## 🎨 类型守卫 (Type Guards)

```typescript
import type { Blog, BlogAuthor } from '@/types';

// 检查 userId 是否为对象
function isBlogAuthor(userId: string | BlogAuthor): userId is BlogAuthor {
  return typeof userId === 'object' && '_id' in userId;
}

// 使用
function getUserId(blog: Blog): string {
  if (isBlogAuthor(blog.userId)) {
    return blog.userId._id;
  }
  return blog.userId;
}
```

## 🌟 最佳实践

### ✅ DO (推荐)
```typescript
// 1. 使用 type import
import type { User } from '@/types';

// 2. 明确类型声明
const user: User = { ... };

// 3. 组件 Props 使用 interface
interface MyComponentProps {
  user: User;
  onUpdate: (user: User) => void;
}

// 4. 使用泛型
function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}
```

### ❌ DON'T (不推荐)
```typescript
// 1. 不要使用 any
const data: any = { ... }; // ❌

// 2. 不要重复定义类型
interface User { ... } // ❌ 已经在 types 中定义

// 3. 不要在组件中定义全局类型
const MyComponent = () => {
  interface User { ... } // ❌ 应该在 types 中定义
}
```

## 📝 命名约定

- **Interface**: `User`, `Blog`, `Comment`
- **Type**: `UserProfile`, `BlogAuthor`
- **Enum**: `NotificationType`
- **Response**: `BlogListResponse`, `CommentsResponse`
- **Request**: `CreateBlogRequest`, `UpdateProfileRequest`

## 🔍 IDE 支持

### VS Code 快捷键
- `Ctrl + Space`: 类型提示
- `F12`: 跳转到定义
- `Shift + F12`: 查找所有引用
- `Ctrl + Click`: 跳转到类型定义

### 自动导入
VS Code 会自动建议导入类型，选择从 `@/types` 导入即可。
