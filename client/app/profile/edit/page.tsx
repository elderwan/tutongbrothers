"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Loader2, Eye, EyeOff, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import {
    getUserProfile,
    updateUserProfile,
    updateUserAvatar,
    updateUserBanner,
    updateUserPassword,
    checkUsernameAvailable,
    checkEmailAvailable
} from "@/api/user";
import { ImageCropper } from "@/components/image-cropper";

export default function EditProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, updateUser } = useAuth();
    const { showError } = useErrorDialog();
    const { showSuccess } = useSuccessDialog();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [showAvatarCropper, setShowAvatarCropper] = useState(false);
    const [showBannerCropper, setShowBannerCropper] = useState(false);

    // Profile form state
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userDesc, setUserDesc] = useState("");
    const [userImg, setUserImg] = useState("");
    const [userBanner, setUserBanner] = useState("");
    const [account, setAccount] = useState("");

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation states
    const [userNameError, setUserNameError] = useState("");
    const [userEmailError, setUserEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/homepage");
            return;
        }

        loadProfile();
    }, [isAuthenticated]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await getUserProfile();

            if (response.code === 200) {
                const profile = response.data;
                setUserName(profile.userName || "");
                setUserEmail(profile.userEmail || "");
                setUserDesc(profile.userDesc || "");
                setUserImg(profile.userImg || "");
                setUserBanner(profile.userBanner || "");
                setAccount(profile.account || "");
            } else {
                showError({
                    code: response.code,
                    title: "Failed to load profile",
                    msg: response.msg
                });
                router.push("/profile");
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            showError({
                code: 500,
                title: "Error",
                msg: "Failed to load profile"
            });
            router.push("/profile");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarCropped = async (imageUrl: string) => {
        try {
            const response = await updateUserAvatar(imageUrl);

            if (response.code === 200) {
                setUserImg(imageUrl);
                showSuccess({
                    title: "Avatar Updated",
                    msg: "Your profile picture has been updated successfully"
                });

                // Update auth context
                if (updateUser) {
                    updateUser({ ...user, userImg: imageUrl });
                }
            } else {
                showError({
                    code: response.code,
                    title: "Failed to update avatar",
                    msg: response.msg
                });
            }
        } catch (error) {
            console.error("Failed to update avatar:", error);
            showError({
                code: 500,
                title: "Error",
                msg: "Failed to update avatar"
            });
        }
    };

    const handleBannerCropped = async (imageUrl: string) => {
        try {
            const response = await updateUserBanner(imageUrl);

            if (response.code === 200) {
                setUserBanner(imageUrl);
                showSuccess({
                    title: "Banner Updated",
                    msg: "Your profile banner has been updated successfully"
                });

                // Update auth context
                if (updateUser) {
                    updateUser({ ...user, userBanner: imageUrl });
                }
            } else {
                showError({
                    code: response.code,
                    title: "Failed to update banner",
                    msg: response.msg
                });
            }
        } catch (error) {
            console.error("Failed to update banner:", error);
            showError({
                code: 500,
                title: "Error",
                msg: "Failed to update banner"
            });
        }
    };

    const validateUserName = async (value: string) => {
        if (!value || value === user?.userName) {
            setUserNameError("");
            return true;
        }

        if (value.length < 2) {
            setUserNameError("Username must be at least 2 characters");
            return false;
        }

        try {
            const response = await checkUsernameAvailable(value);
            if (response.code === 200 && !response.data.available) {
                setUserNameError("Username is already taken");
                return false;
            }
            setUserNameError("");
            return true;
        } catch (error) {
            return true; // Don't block if check fails
        }
    };

    const validateEmail = async (value: string) => {
        if (!value || value === user?.userEmail) {
            setUserEmailError("");
            return true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setUserEmailError("Invalid email format");
            return false;
        }

        try {
            const response = await checkEmailAvailable(value);
            if (response.code === 200 && !response.data.available) {
                setUserEmailError("Email is already taken");
                return false;
            }
            setUserEmailError("");
            return true;
        } catch (error) {
            return true; // Don't block if check fails
        }
    };

    const handleSaveProfile = async () => {
        // Validate fields
        const isUserNameValid = await validateUserName(userName);
        const isEmailValid = await validateEmail(userEmail);

        if (!isUserNameValid || !isEmailValid) {
            return;
        }

        try {
            setSaving(true);

            const response = await updateUserProfile({
                userName: userName !== user?.userName ? userName : undefined,
                userEmail: userEmail !== user?.userEmail ? userEmail : undefined,
                userDesc
            });

            if (response.code === 200) {
                showSuccess({
                    title: "Profile Updated",
                    msg: "Your profile has been updated successfully"
                });

                // Update auth context
                if (updateUser) {
                    updateUser({
                        ...user,
                        userName: response.data.userName,
                        userEmail: response.data.userEmail,
                        userDesc: response.data.userDesc
                    });
                }

                // Redirect to profile page
                setTimeout(() => router.push("/profile"), 1000);
            } else {
                showError({
                    code: response.code,
                    title: "Failed to update profile",
                    msg: response.msg
                });
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            showError({
                code: 500,
                title: "Error",
                msg: "Failed to update profile"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        // Validate password fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("All password fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            setPasswordError(
                "Password must be at least 6 characters with uppercase, lowercase, number and special character"
            );
            return;
        }

        try {
            setUpdatingPassword(true);
            setPasswordError("");

            const response = await updateUserPassword({
                currentPassword,
                newPassword
            });

            if (response.code === 200) {
                showSuccess({
                    title: "Password Updated",
                    msg: "Your password has been changed successfully"
                });

                // Clear password fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPasswordError(response.msg);
                showError({
                    code: response.code,
                    title: "Failed to update password",
                    msg: response.msg
                });
            }
        } catch (error) {
            console.error("Failed to update password:", error);
            setPasswordError("Failed to update password");
            showError({
                code: 500,
                title: "Error",
                msg: "Failed to update password"
            });
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            <div className="max-w-[600px] mx-auto border-x min-h-screen">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
                    <div className="flex items-center gap-8 px-4 h-[53px]">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => router.push("/profile")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">Edit profile</h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pb-4">
                    {/* Banner and Avatar Preview Section - Like Homepage */}
                    <div className="relative">
                        {/* Banner */}
                        <div className="relative h-[200px] bg-gradient-to-r from-blue-400 to-purple-500">
                            {userBanner && (
                                <img
                                    src={userBanner}
                                    alt="Profile banner"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <Button
                                size="icon"
                                className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70"
                                onClick={() => setShowBannerCropper(true)}
                            >
                                <Camera className="h-4 w-4 text-white" />
                            </Button>
                        </div>

                        {/* Avatar positioned over banner */}
                        <div className="absolute -bottom-16 left-4">
                            <div className="relative">
                                <Avatar className="h-32 w-32 border-4 border-white">
                                    <AvatarImage src={userImg} alt={userName} />
                                    <AvatarFallback className="text-4xl">
                                        {userName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    className="absolute bottom-0 right-0 rounded-full h-10 w-10  bg-black/50 hover:bg-black/70 "
                                    onClick={() => setShowAvatarCropper(true)}
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for avatar */}
                    <div className="h-20"></div>

                    {/* Profile Information */}
                    <div className="border-b p-4 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

                            {/* Account (Read-only) */}
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="account" className="text-gray-600 text-sm">
                                    Account
                                </Label>
                                <Input
                                    id="account"
                                    value={account}
                                    disabled
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>

                            {/* Username */}
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="userName" className="text-gray-600 text-sm">
                                    Username
                                </Label>
                                <Input
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    onBlur={(e) => validateUserName(e.target.value)}
                                    placeholder="Enter your username"
                                    className="border-gray-200"
                                />
                                {userNameError && (
                                    <p className="text-sm text-red-500">{userNameError}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="userEmail" className="text-gray-600 text-sm">
                                    Email
                                </Label>
                                <Input
                                    id="userEmail"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    onBlur={(e) => validateEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="border-gray-200"
                                />
                                {userEmailError && (
                                    <p className="text-sm text-red-500">{userEmailError}</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="userDesc" className="text-gray-600 text-sm">
                                    Bio
                                </Label>
                                <Textarea
                                    id="userDesc"
                                    value={userDesc}
                                    onChange={(e) => setUserDesc(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    maxLength={500}
                                    className="border-gray-200 resize-none"
                                />
                                <p className="text-xs text-gray-500 text-right">
                                    {userDesc.length}/500
                                </p>
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                disabled={saving || !!userNameError || !!userEmailError}
                                className="w-full rounded-full"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Change Password</h2>

                        {/* Current Password */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="currentPassword" className="text-gray-600 text-sm">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="border-gray-200 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="newPassword" className="text-gray-600 text-sm">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="border-gray-200 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="confirmPassword" className="text-gray-600 text-sm">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="border-gray-200 pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {passwordError && (
                            <p className="text-sm text-red-500 mb-4">{passwordError}</p>
                        )}

                        <p className="text-xs text-gray-500 mb-4">
                            Password must be at least 6 characters with uppercase, lowercase, number and special character
                        </p>

                        <Button
                            onClick={handleUpdatePassword}
                            disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword}
                            variant="secondary"
                            className="w-full rounded-full"
                        >
                            {updatingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Image Cropper Modals */}
            <ImageCropper
                isOpen={showAvatarCropper}
                onClose={() => setShowAvatarCropper(false)}
                onImageCropped={handleAvatarCropped}
            />
            <ImageCropper
                isOpen={showBannerCropper}
                onClose={() => setShowBannerCropper(false)}
                onImageCropped={handleBannerCropped}
                aspectRatio={13 / 5}
            />

        </div>
    );
}
