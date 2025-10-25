# 🧪 Testing Guide - Blog & Post System

## ✅ Build Status: SUCCESS

Both backend and frontend compile without errors!

---

## 🚀 Starting Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Expected output: `🚀 Server running on http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Expected output: `✓ Ready on http://localhost:3000`

---

## 📝 Manual Testing Checklist

### 1. ✅ Test Signup with Auto-Generated Account

**Steps:**
1. Navigate to: `http://localhost:3000`
2. Click "Sign Up" button
3. Fill in:
   - Email: `test@example.com`
   - Username: `TestUser`
   - Password: `Test123!@#`
4. **Verify**: No account field visible
5. Click "Sign up"

**Expected Result:**
- ✅ Account created successfully
- ✅ Account auto-generated as: `20251025HHMMSS100000`
- ✅ Redirected to homepage or login

---

### 2. ✅ Test Profile Account Editing

**Steps:**
1. Login with the test account
2. Navigate to: `http://localhost:3000/profile/edit`
3. Find "Account" field
4. **Verify**: Shows auto-generated account
5. Change to: `mycustomaccount`
6. Click "Save Changes"

**Expected Result:**
- ✅ Account updated successfully
- ✅ Profile page shows new account

**Test Uniqueness:**
1. Try to set account to existing one
2. **Expected**: Error "Account already taken"

---

### 3. ✅ Test Post Type Selection Dialog

**Steps:**
1. Click "Post" button in navigation (top right)
2. **Verify**: Dialog appears with 2 options
   - 📖 Blog - "Write a full article"
   - 💬 Post - "Quick update"

**Test Blog Option:**
1. Click "Blog"
2. **Expected**: Redirected to `/post` page (existing blog creation)

**Test Post Option:**
1. Click "Post" button again
2. Click "Post" option
3. **Expected**: Create Post Dialog opens

---

### 4. ✅ Test Create Post Dialog

**Steps:**
1. Open Create Post Dialog (see step 3)
2. Type content:
   ```
   Hello world! Testing @TestUser mention feature 🎉
   
   This is my first post with multiple lines!
   #testing #newfeature
   ```
3. Click "Images" button
4. Upload 3 images
5. **Verify**: 
   - Images appear in preview
   - Counter shows "3/18"
   - Each image has X button

**Test Image Removal:**
1. Click X on one image
2. **Expected**: Image removed, counter shows "2/18"

**Test Maximum Images:**
1. Try to upload 17 more images (total 19)
2. **Expected**: Error "Maximum 18 images allowed"

**Submit Post:**
1. Click "Post" button
2. **Expected**:
   - Success message
   - Dialog closes
   - Post appears in feed

---

### 5. ✅ Test Blog List Page with Filter

**Steps:**
1. Navigate to: `http://localhost:3000/blog`
2. **Verify**: Three tabs appear
   - "All"
   - "Blogs"
   - "Posts"

**Test "All" Tab:**
1. Click "All" tab
2. **Expected**: Shows both blogs and posts mixed
3. **Verify**: Different card designs

**Test "Blogs" Tab:**
1. Click "Blogs" tab
2. **Expected**: Shows only blog cards (with title, description)

**Test "Posts" Tab:**
1. Click "Posts" tab
2. **Expected**: Shows only post cards (no title, social layout)

---

### 6. ✅ Test Post Card Features

**Find a post card in the feed:**

**Test @Mention Highlighting:**
1. Look for @mentions in post content
2. **Expected**: 
   - @username in blue/accent color
   - Hover shows underline
   - Clickable (future: goes to user profile)

**Test Like Button:**
1. Click heart icon ❤️
2. **Expected**:
   - Icon fills with red
   - Like count increases
   - Click again to unlike

**Test Comment Button:**
1. Click comment icon 💬
2. **Expected**: Shows comment count
3. (Future: Opens comment dialog)

**Test Image Gallery:**
1. Find post with multiple images
2. **Expected**:
   - 1 image: Full width
   - 2 images: 2 columns
   - 3+ images: 3 column grid
   - 6+ images: Shows "+N" overlay on 6th image

**Test "Read More":**
1. Find post with long content (>280 chars)
2. **Expected**:
   - Content truncated with "..."
   - "Read more" button appears
3. Click "Read more"
4. **Expected**: Full content shows, button says "Show less"

**Test Time Ago:**
1. Check timestamp on posts
2. **Expected**: Shows "just now", "5m ago", "2h ago", "3d ago"

---

### 7. ✅ Test Post API Endpoints

**Using Browser DevTools or Postman:**

**Create Post:**
```
POST http://localhost:5000/api/posts
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "content": "Test post via API",
  "images": ["https://example.com/image1.jpg"],
  "mentions": ["TestUser"]
}
```
**Expected**: 201 Created, returns post object

**Get Posts:**
```
GET http://localhost:5000/api/posts?page=1&limit=20
```
**Expected**: 200 OK, returns array of posts

**Like Post:**
```
POST http://localhost:5000/api/posts/POST_ID/like
Headers: Authorization: Bearer YOUR_TOKEN
```
**Expected**: 200 OK, returns liked status

---

## 🐛 Known Issues / TODO

### Image Upload
- ⚠️ Currently uses local blob URLs
- 🔜 Need to integrate Cloudinary for production
- 📍 Location: `create-post-dialog.tsx` line 32

### @Mention Notifications
- ⚠️ Mentions extracted but not sent yet
- 🔜 Need notification system
- 📍 Location: `postController.ts` line 52

### Post Editing
- ⚠️ Not yet implemented
- 🔜 Add edit button for own posts

---

## ✅ Test Results Template

Copy and fill out:

```
## Test Run: [Date/Time]

### Environment
- Backend: Running ✅ / Failed ❌
- Frontend: Running ✅ / Failed ❌
- Database: Connected ✅ / Failed ❌

### Feature Tests
1. Signup Auto-Generation: ✅ / ❌
   Notes: ___________
   
2. Profile Account Edit: ✅ / ❌
   Notes: ___________
   
3. Post Type Dialog: ✅ / ❌
   Notes: ___________
   
4. Create Post: ✅ / ❌
   - Content input: ✅ / ❌
   - Image upload: ✅ / ❌
   - @mentions: ✅ / ❌
   Notes: ___________
   
5. Blog List Filter: ✅ / ❌
   - All tab: ✅ / ❌
   - Blogs tab: ✅ / ❌
   - Posts tab: ✅ / ❌
   Notes: ___________
   
6. Post Card Features: ✅ / ❌
   - Like button: ✅ / ❌
   - Comment button: ✅ / ❌
   - @mention highlight: ✅ / ❌
   - Image gallery: ✅ / ❌
   - Read more: ✅ / ❌
   Notes: ___________

### Bugs Found
1. [Description]
2. [Description]

### Notes
[Any additional observations]
```

---

## 🎉 All Tests Pass Criteria

System is ready for production when:
- ✅ All servers start without errors
- ✅ Signup creates account automatically
- ✅ Profile account can be edited
- ✅ Post type dialog shows correctly
- ✅ Posts can be created with images
- ✅ @mentions are highlighted
- ✅ Blog list shows filtered content
- ✅ Post cards display correctly
- ✅ Like/comment buttons work
- ✅ No console errors
- ✅ Responsive on mobile

**Next Steps After Testing:**
1. Fix any bugs found
2. Integrate Cloudinary for images
3. Implement notification system
4. Add post editing
5. Deploy to production

---

**Happy Testing! 🚀**
