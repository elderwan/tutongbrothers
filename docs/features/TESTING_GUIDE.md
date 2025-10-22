# Quick Start Guide - Profile Feature Testing

## 🚀 Start the Application

### Terminal 1 - Backend
```powershell
cd d:\workspace\VSCode\blog\backend
npm run dev
```

### Terminal 2 - Frontend
```powershell
cd d:\workspace\VSCode\blog\client
npm run dev
```

## 🧪 Test Scenarios

### 1. View Profile
1. Login to your account
2. Navigate to `/profile` or click profile icon in navigation
3. **Expected**: See your avatar, name, email, bio, followers/following counts

### 2. Edit Profile Information
1. On profile page, click **"Edit Profile"** button
2. Modify username - try entering an existing username (should show error)
3. Modify email - try invalid format (should show error)
4. Add/edit bio (max 500 characters)
5. Click **"Save Changes"**
6. **Expected**: Success message, redirect to profile, changes reflected

### 3. Update Profile Picture
1. On edit page, click camera icon on avatar
2. Select an image file (JPG, PNG, GIF)
3. **Expected**: 
   - Upload progress indicator
   - Success message
   - New avatar displayed immediately

### 4. Change Password
1. On edit page, scroll to "Change Password" section
2. Enter current password
3. Enter new password (must meet requirements)
4. Confirm new password
5. Click **"Update Password"**
6. **Expected**: Success message, password fields cleared

### 5. View Followers/Following
1. On profile page, click on "Followers" count
2. **Expected**: Modal opens showing list of followers with avatars
3. Close modal, click on "Following" count
4. **Expected**: Modal opens showing list of people you follow

## ✅ Validation Tests

### Username Validation
- ❌ Less than 2 characters → Error
- ❌ Already taken → Error
- ✅ Unique, 2+ characters → Success

### Email Validation
- ❌ Invalid format (no @) → Error
- ❌ Already taken → Error
- ✅ Valid format, unique → Success

### Password Validation
- ❌ Less than 6 characters → Error
- ❌ No uppercase letter → Error
- ❌ No lowercase letter → Error
- ❌ No number → Error
- ❌ No special character → Error
- ❌ Passwords don't match → Error
- ❌ Current password incorrect → Error
- ✅ Meets all requirements → Success

### Avatar Upload Validation
- ❌ File > 2MB → Error
- ❌ Non-image file → Error
- ✅ Valid image < 2MB → Success

## 🐛 Common Issues & Solutions

### Issue: Card component error
**Solution**: Restart VS Code or run `npx tsc --noEmit` to rebuild types

### Issue: Cloudinary upload fails
**Solution**: Verify credentials in `client/lib/uploadImage.ts`:
- Cloud name: `dewxaup4t`
- Upload preset: `blog_images`

### Issue: 401 Unauthorized errors
**Solution**: Ensure you're logged in and token is valid

### Issue: Changes not persisting
**Solution**: Check MongoDB connection and ensure database is running

## 📱 Responsive Testing

Test on different screen sizes:
1. **Mobile** (375px): Chrome DevTools → iPhone SE
2. **Tablet** (768px): Chrome DevTools → iPad
3. **Desktop** (1920px): Full screen browser

**Expected**: Layout adapts smoothly, no horizontal scrolling, touch-friendly buttons

## 🔍 Browser Console Checks

Open DevTools (F12) and check:
- ✅ No console errors
- ✅ Network requests return 200 status
- ✅ Cookies updated after profile changes

## 📊 Database Verification

After making changes, check MongoDB:
```javascript
// In MongoDB shell or Compass
db.users.findOne({ _id: ObjectId("YOUR_USER_ID") })
```

**Expected fields updated**:
- `userName`
- `userEmail`
- `userDesc`
- `userImg`
- `password` (hashed)

---

**Happy Testing! 🎉**
