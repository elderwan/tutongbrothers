# Profile Tabs 实现 - 阶段性总结

## 已完成工作

### 1. 后端扩展
- ✅ User Model 添加 `userBanner` 字段
- ✅ 添加 `updateUserBanner` API (PUT /users/banner)
- ✅ `getBlogs` API 支持 `userId` 参数过滤

### 2. 前端组件
- ✅ 创建 `BlogCardHorizontal` 组件（横向博文卡片）
- ✅ Edit Profile 页面完全重构：
  - 添加背景图上传（使用ImageCropper）
  - 预览布局与主页一致（banner + avatar）
  - 两个独立的ImageCropper实例（头像和背景图）

### 3. API 方法
- ✅ `client/api/blog.ts` 添加 `getBlogsByUserId()` 方法
- ✅ `client/api/user.ts` 添加 `updateUserBanner()` 方法
- ✅ `client/type/User.ts` 添加 `userBanner` 字段

## 待实现功能

### Posts Tab (优先级：高)
**状态**: 准备就绪，只需更新Profile页面UI

**实现步骤：**
1. 在 Profile 页面添加 tab 状态管理
2. 调用 `getBlogsByUserId(profile.id)` 加载用户博文
3. 使用 `BlogCardHorizontal` 组件渲染列表
4. 添加分页功能

**代码片段：**
```typescript
const [activeTab, setActiveTab] = useState("posts");
const [posts, setPosts] = useState([]);

const loadPosts = async () => {
  const response = await getBlogsByUserId(profile.id);
  if (response.code === 200) {
    setPosts(response.data.blogs);
  }
};
```

### Replies Tab (优先级：中)
**状态**: 需要后端支持

**需要添加的后端API：**
- `GET /comments/user/:userId` - 获取用户的所有评论
- 返回格式：
  ```json
  {
    "comments": [{
      "_id": "commentId",
      "content": "评论内容",
      "blogId": "所属博文ID",
      "blogTitle": "博文标题",
      "createdAt": "时间"
    }]
  }
  ```

**前端实现：**
- 创建 `CommentItem` 组件显示评论
- 点击评论跳转到 `/blog/[blogId]`

### Likes Tab (优先级：中)
**状态**: 需要后端支持

**需要添加的后端API：**
- `GET /users/:userId/likes` - 获取用户点赞的内容
- 返回格式：
  ```json
  {
    "blogs": [{博文信息}],
    "comments": [{评论信息}]
  }
  ```

**前端实现：**
- 博文使用 `BlogCardHorizontal` 组件
- 评论使用 `CommentItem` 组件
- 点击跳转到相应详情页

## 下一步行动计划

### 选项 A：快速实现Posts Tab
1. 更新 `client/app/profile/page.tsx`
2. 添加 tab切换UI
3. 实现 Posts tab 加载和显示
4. Replies 和 Likes 显示 "Coming soon"
5. 同步更新 `client/app/profile/[userId]/page.tsx`

### 选项 B：完整实现全部功能
1. 后端添加获取用户评论的API
2. 后端添加获取用户点赞的API
3. 前端实现全部三个tabs
4. 更新两个Profile页面

## 当前建议

**推荐选项 A**，原因：
1. Posts tab最核心，已具备所有条件
2. 可以快速看到效果
3. Replies 和 Likes 可以后续迭代
4. 避免一次性修改太多文件

## 技术细节

### Profile页面需要更新的部分

1. **添加状态**
```typescript
const [activeTab, setActiveTab] = useState<"posts" | "replies" | "likes">("posts");
const [posts, setPosts] = useState<any[]>([]);
const [loadingPosts, setLoadingPosts] = useState(false);
```

2. **更新Banner显示**
```tsx
<div className="relative h-[200px] bg-gradient-to-r from-blue-400 to-purple-500">
  {profile.userBanner && (
    <img src={profile.userBanner} alt="Banner" className="w-full h-full object-cover" />
  )}
</div>
```

3. **实现Tabs UI**
```tsx
<div className="border-t">
  <div className="flex">
    {["posts", "replies", "likes"].map(tab => (
      <button
        key={tab}
        className={`flex-1 py-4 font-semibold capitalize ${
          activeTab === tab ? "border-b-2 border-blue-500" : "text-gray-500"
        }`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
</div>
```

4. **渲染Posts**
```tsx
{activeTab === "posts" && (
  <div>
    {loadingPosts ? (
      <div className="p-12 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    ) : posts.length === 0 ? (
      <div className="p-12 text-center text-gray-500">No posts yet</div>
    ) : (
      posts.map(post => (
        <BlogCardHorizontal
          key={post._id}
          id={post._id}
          title={post.title}
          content={post.content}
          coverImage={post.images?.[0]}
          author={{
            id: post.userId,
            name: post.userName,
            avatar: post.userImg
          }}
          createdAt={post.createdAt}
          likes={post.likes?.length || 0}
          comments={post.comments?.length || 0}
          views={post.views || 0}
          tags={post.tags}
        />
      ))
    )}
  </div>
)}
```

## 文件清单

已修改：
- ✅ `backend/src/models/User.ts`
- ✅ `backend/src/controllers/userController.ts`
- ✅ `backend/src/routes/userRoutes.ts`
- ✅ `client/type/User.ts`
- ✅ `client/api/user.ts`
- ✅ `client/api/blog.ts`
- ✅ `client/components/blog/blog-card-horizontal.tsx`
- ✅ `client/app/profile/edit/page.tsx`

待修改：
- ⏳ `client/app/profile/page.tsx`
- ⏳ `client/app/profile/[userId]/page.tsx`

建议下一步：直接修改这两个Profile文件，实现Posts tab功能。

是否继续？
