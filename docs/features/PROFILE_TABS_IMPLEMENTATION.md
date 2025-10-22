# Profile Tabs 实现方案

## 概述
为 Profile 页面添加三个功能性 tabs：Posts（博文）、Replies（回复）、Likes（点赞）

## 文件修改清单

### 1. 后端API（已完成）
- ✅ `getBlogs` API 已支持 `userId` 参数过滤用户博文
- ✅ User Model 已添加 `userBanner` 字段
- ✅ 已添加 `updateUserBanner` API

### 2. 前端组件（已完成）
- ✅ `client/components/blog/blog-card-horizontal.tsx` - 横向博文卡片组件

### 3. 需要修改的文件

#### A. client/app/profile/page.tsx
**添加功能：**
1. 显示用户背景图（userBanner）
2. 实现 Posts tab - 显示用户发布的博文列表
3. 实现 Replies tab - 显示用户回复的评论列表
4. 实现 Likes tab - 显示用户点赞的博文和评论

**Tab 状态管理：**
```typescript
const [activeTab, setActiveTab] = useState<"posts" | "replies" | "likes">("posts");
const [posts, setPosts] = useState([]);
const [replies, setReplies] = useState([]);
const [likes, setLikes] = useState([]);
```

**API 调用：**
- Posts: `GET /api/blogs?userId=${profileId}`
- Replies: 需要后端新增API或从现有comment API获取
- Likes: 需要后端新增API或从Blog model的likes数组获取

#### B. client/app/profile/[userId]/page.tsx
**修改：**
- 同样添加 Posts/Replies/Likes tabs功能
- 显示userBanner
- 代码结构与 page.tsx 一致

#### C. client/api/blog.ts
**添加方法：**
```typescript
// 根据用户ID获取博文
export async function getBlogsByUserId(userId: string, page: number = 1, limit: number = 10)

// 获取用户的回复评论（如果后端支持）
export async function getUserComments(userId: string)

// 获取用户点赞的内容（如果后端支持）
export async function getUserLikes(userId: string)
```

## 实现步骤

### Step 1: 检查现有 blog API
查看 `client/api/blog.ts` 确认现有方法，添加缺失的API调用方法

### Step 2: 更新 Profile 页面
1. 在页面顶部 banner 区域显示 `userBanner`（如果有）
2. 添加 Tab 切换UI（使用 shadcn/ui tabs 或自定义）
3. 实现 Posts tab 内容加载和显示
4. 实现 Replies tab（暂时可以显示"Coming soon"）
5. 实现 Likes tab（暂时可以显示"Coming soon"）

### Step 3: 更新 [userId] 页面
复制 Profile 页面的改动到动态路由页面

### Step 4: 后端支持（如果需要）
如果 Replies 和 Likes 需要专门的API：
1. 在 `commentController.ts` 添加 `getUserComments`
2. 在 `blogController.ts` 添加 `getUserLikes`
3. 在对应的 routes 文件中添加路由

## UI 设计规范

### Tabs 组件
```tsx
<div className="border-b">
  <div className="flex">
    <button 
      className={`flex-1 py-4 font-semibold ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab('posts')}
    >
      Posts
    </button>
    <button 
      className={`flex-1 py-4 font-semibold ${activeTab === 'replies' ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab('replies')}
    >
      Replies
    </button>
    <button 
      className={`flex-1 py-4 font-semibold ${activeTab === 'likes' ? 'border-b-2 border-blue-500' : ''}`}
      onClick={() => setActiveTab('likes')}
    >
      Likes
    </button>
  </div>
</div>
```

### Posts Tab 内容
```tsx
{activeTab === 'posts' && (
  <div>
    {posts.length === 0 ? (
      <div className="p-8 text-center text-gray-500">
        No posts yet
      </div>
    ) : (
      posts.map(post => (
        <BlogCardHorizontal key={post._id} {...post} />
      ))
    )}
  </div>
)}
```

### Banner 显示
```tsx
<div className="relative h-[200px] bg-gradient-to-r from-blue-400 to-purple-500">
  {profile.userBanner && (
    <img
      src={profile.userBanner}
      alt="Profile banner"
      className="w-full h-full object-cover"
    />
  )}
</div>
```

## 当前状态
- ✅ 博文卡片组件已创建
- ✅ Edit Profile 页面已添加背景图上传
- ⏳ Profile 页面需要添加 tabs 和背景图显示
- ⏳ [userId] 页面需要同步更新

## 下一步
由于文件较大且涉及多个修改点，建议：
1. 先实现最核心的 Posts tab 功能
2. 在 Profile 和 [userId] 页面添加背景图显示
3. Replies 和 Likes 可以先显示占位UI
4. 后续根据需求完善 Replies 和 Likes 的后端API和前端实现
