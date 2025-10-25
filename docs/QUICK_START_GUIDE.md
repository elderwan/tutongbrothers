# 🚀 Quick Start Guide - Blog & Post System

## Prerequisites
- Node.js installed
- MongoDB running
- Environment variables configured

## Step 1: Start Backend Server

```bash
cd backend
npm run build
npm run dev
```

Backend will start on: `http://localhost:5000` (or your configured port)

## Step 2: Start Frontend Client

```bash
cd client
npm run dev
```

Frontend will start on: `http://localhost:3000`

---

## Testing the New Features

### 1. Test Account Auto-Generation

**Sign Up Flow:**
1. Navigate to homepage
2. Click "Sign Up" button
3. Fill in:
   - Email: `test@example.com`
   - Username: `TestUser`
   - Password: `Test123!@#`
4. Notice: **No account field** (auto-generated)
5. Submit signup
6. Account will be created as: `20251025130000100000` (date + userCode)

**Verify:**
- After signup, go to Profile → Edit
- See auto-generated account in editable field
- Try changing it to custom value

---

### 2. Test Post Type Selection

**Create Post Flow:**
1. Click "Post" button in navigation
2. See dialog with two options:
   - 📖 **Blog** - Write a full article
   - 💬 **Post** - Quick update
3. Click **Post** option

---

### 3. Test Post Creation

**In Create Post Dialog:**
1. Write content: 
   ```
   Hello world! This is my first post on @TestUser platform! 🎉
   
   Testing the new features:
   - No word limit ✅
   - Multiple images ✅
   - @mentions support ✅
   ```

2. Click "Images" button
3. Upload 1-18 images
4. See image previews with remove button
5. Click "Post"

**Verify:**
- Post appears in feed
- @mentions are highlighted
- Images display in grid
- Like/comment buttons work

---

### 4. Test Blog vs Post Filter

**In Blog List Page (`/blog`):**
1. See three tabs at top:
   - **All** - Shows both blogs and posts
   - **Blogs** - Shows only blogs (with title, description)
   - **Posts** - Shows only posts (social media style)

2. Click each tab to filter
3. Notice different card designs:
   - **Blog Card**: Title, description, single image, formal
   - **Post Card**: No title, content, image grid, social

---

### 5. Test Post Features

**Like a Post:**
1. Click ❤️ heart icon
2. Count increases
3. Icon fills with red
4. Click again to unlike

**Comment on Post:**
1. Click 💬 comment icon
2. (Future: Opens comment dialog)
3. See comment count

**View Post Details:**
1. Click on post card
2. See full post with all images
3. View count increases

---

### 6. Test Profile Account Edit

1. Go to `/profile/edit`
2. Find "Account" field
3. Change value: `mycustomaccount123`
4. Click "Save Changes"
5. Verify unique validation works
6. Success: Account updated

---

## API Endpoints Reference

### Posts
```bash
# Create post
POST /api/posts
Body: { content, images, mentions }

# Get all posts
GET /api/posts?page=1&limit=20

# Get post by ID
GET /api/posts/:id

# Like post
POST /api/posts/:id/like

# Comment on post
POST /api/posts/:id/comment
Body: { content, parentId }

# Delete post
DELETE /api/posts/:id

# Get user's posts
GET /api/posts/user/:userId
```

### Users
```bash
# Update profile (now includes account)
PUT /api/users/profile
Body: { userName, userEmail, userDesc, account }
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is running
# Check .env file exists with correct config
# Try: npm install && npm run build && npm run dev
```

### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Account Not Auto-Generating
- Check `userController.ts` has latest changes
- Rebuild backend: `npm run build`
- Restart backend server

### Posts Not Showing
- Check backend logs for errors
- Verify MongoDB connection
- Check browser console for API errors
- Verify post routes registered in `server.ts`

### Images Not Uploading
- Current version uses local URLs
- For production, integrate with Cloudinary
- See `create-post-dialog.tsx` TODO comment

---

## Database Check

### View Posts in MongoDB
```bash
# Connect to MongoDB
mongo

# Use your database
use your_database_name

# View posts
db.posts.find().pretty()

# View users with auto-generated accounts
db.users.find({}, {account: 1, userCode: 1, userName: 1}).pretty()
```

---

## Next Steps

1. ✅ Test all features above
2. ✅ Create test data (users, posts, blogs)
3. ✅ Verify filtering works correctly
4. ✅ Test responsive design on mobile
5. 🔜 Implement @mention notifications
6. 🔜 Add image upload to Cloudinary
7. 🔜 Add post editing capability
8. 🔜 Add user mention autocomplete

---

## 🎉 Enjoy Your New Blog & Post System!

You now have a fully functional social media style posting system alongside traditional blogging. Users can:
- Sign up with auto-generated accounts
- Create quick posts or detailed blogs
- Upload up to 18 images per post
- @mention other users
- Like, comment, and share
- Filter between content types
- Edit their account in profile settings

**Happy posting! 🚀**
