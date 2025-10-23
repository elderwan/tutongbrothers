"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Loader2 } from "lucide-react";
import { getUserProfile, getFollowers, getFollowing, type FollowUser } from "@/api/user";
import { getBlogsByUserId, type Blog } from "@/api/blog";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { dateFormat } from "@/lib/date";
import { BlogCardHorizontal } from "@/components/blog/blog-card-horizontal";

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { showError } = useErrorDialog();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Tabs state
    const [activeTab, setActiveTab] = useState<"posts" | "replies" | "likes">("posts");
    const [posts, setPosts] = useState<Blog[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Followers/Following modal state
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    const [loadingFollowing, setLoadingFollowing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/homepage");
            return;
        }

        loadProfile();
    }, [isAuthenticated]);

    useEffect(() => {
        if (profile && activeTab === "posts") {
            loadPosts();
        }
    }, [profile, activeTab]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await getUserProfile(user?.id);

            if (response.code === 200) {
                setProfile(response.data);
            } else {
                showError({
                    code: response.code,
                    title: "Failed to load profile",
                    msg: response.msg
                });
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            showError({
                code: 500,
                title: "Error",
                msg: "Failed to load profile"
            });
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        if (!profile?.id) return;

        try {
            setLoadingPosts(true);
            const response = await getBlogsByUserId(profile.id, 1, 20);

            if (response.code === 200) {
                setPosts(response.data.blogs);
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const loadFollowers = async () => {
        try {
            setLoadingFollowers(true);
            const response = await getFollowers(undefined, 1, 100);

            if (response.code === 200) {
                setFollowers(response.data.users);
            }
        } catch (error) {
            console.error("Failed to load followers:", error);
        } finally {
            setLoadingFollowers(false);
        }
    };

    const loadFollowing = async () => {
        try {
            setLoadingFollowing(true);
            const response = await getFollowing(undefined, 1, 100);

            if (response.code === 200) {
                setFollowing(response.data.users);
            }
        } catch (error) {
            console.error("Failed to load following:", error);
        } finally {
            setLoadingFollowing(false);
        }
    };

    const handleFollowersClick = () => {
        setShowFollowersModal(true);
        loadFollowers();
    };

    const handleFollowingClick = () => {
        setShowFollowingModal(true);
        loadFollowing();
    };

    const handleUserClick = (userId: string) => {
        router.push(`/profile/${userId}`);
        setShowFollowersModal(false);
        setShowFollowingModal(false);
    };

    // Check if current user is viewing their own profile
    const isOwnProfile = user?.id === profile?.id;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <p className="text-gray-500">Profile not found</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-cream">
                <div className="max-w-[600px] mx-auto border-x border-gray-200 min-h-screen">
                    {/* Header Banner */}
                    <div className="relative">
                        <div className="h-[200px] bg-gradient-to-r from-blue-400 to-purple-500">
                            {profile.userBanner && (
                                <img
                                    src={profile.userBanner}
                                    alt="Profile banner"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="absolute -bottom-16 left-4">
                            <Avatar className="h-32 w-32 border-4 border-white">
                                <AvatarImage src={profile.userImg} alt={profile.userName} />
                                <AvatarFallback className="text-4xl bg-gray-200">{profile.userName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>


                    </div>

                    {/* Profile Info */}
                    <div className="mt-20 px-4 pb-4">
                        {/* Name and Username */}
                        <div className="mb-3">
                            <h1 className="text-xl font-bold text-gray-900">
                                {profile.userName}
                            </h1>
                            <p className="text-gray-500">@{profile.account}</p>
                        </div>

                        {/* Bio */}
                        {profile.userDesc && (
                            <div className="mb-3">
                                <p className="text-gray-900 whitespace-pre-wrap">{profile.userDesc}</p>
                            </div>
                        )}

                        {/* Join Date */}
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {profile.createdAt ? dateFormat(profile.createdAt) : 'Recently'}</span>
                            </div>
                        </div>

                        {/* Following/Followers */}
                        <div className="flex gap-5 text-sm justify-between">
                            <div className="flex gap-5">
                                <button
                                    onClick={handleFollowingClick}
                                    className="hover:underline transition-all"
                                >
                                    <span className="font-bold text-gray-900">{profile.followingCount || 0}</span>
                                    <span className="text-gray-500 ml-1">Following</span>
                                </button>
                                <button
                                    onClick={handleFollowersClick}
                                    className="hover:underline transition-all"
                                >
                                    <span className="font-bold text-gray-900">{profile.followersCount || 0}</span>
                                    <span className="text-gray-500 ml-1">Followers</span>
                                </button>
                            </div>

                            {/* Edit Profile Button - Only show if viewing own profile */}
                            {isOwnProfile && (
                                <div className="">
                                    <Button
                                        onClick={() => router.push("/profile/edit")}
                                        variant="outline"
                                        className=" cursor-pointer rounded-full font-semibold bg-white hover:bg-gray-100 hover:text-[#344F1F] border-gray-300"
                                        size="sm"
                                    >
                                        Edit profile
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="border-t border-gray-200 mt-4">
                        <div className="flex">
                            <button
                                className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "posts"
                                    ? "border-b-2 border-gray-500 text-gray-500"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                                onClick={() => setActiveTab("posts")}
                            >
                                Posts
                            </button>
                            <button
                                className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "replies"
                                    ? "border-b-2 border-gray-500 text-gray-500"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                                onClick={() => setActiveTab("replies")}
                            >
                                Replies
                            </button>
                            <button
                                className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === "likes"
                                    ? "border-b-2 border-gray-500 text-gray-500"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                                onClick={() => setActiveTab("likes")}
                            >
                                Likes
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "posts" && (
                        <div>
                            {loadingPosts ? (
                                <div className="p-12 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <p>No posts yet</p>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <BlogCardHorizontal
                                        key={post._id}
                                        id={post._id}
                                        title={post.title}
                                        content={post.content}
                                        coverImage={post.images?.[0]}
                                        author={{
                                            id: typeof post.userId === 'string' ? post.userId : post.userId._id,
                                            name: post.userName,
                                            avatar: post.userImg
                                        }}
                                        createdAt={post.createdAt}
                                        likes={post.likes?.length || 0}
                                        comments={post.commentsCount || 0}
                                        views={post.views || 0}
                                        tags={[post.type]}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "replies" && (
                        <div className="p-12 text-center text-gray-500">
                            <p>Replies feature coming soon...</p>
                        </div>
                    )}

                    {activeTab === "likes" && (
                        <div className="p-12 text-center text-gray-500">
                            <p>Likes feature coming soon...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Followers Modal */}
            <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
                <DialogContent className="max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-xl font-bold">Followers</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1">
                        {loadingFollowers ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : followers.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500">No followers yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {followers.map((follower) => (
                                    <button
                                        key={follower._id}
                                        onClick={() => handleUserClick(follower._id)}
                                        className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={follower.userImg} alt={follower.userName} />
                                            <AvatarFallback>{follower.userName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{follower.userName}</p>
                                            {follower.userDesc && (
                                                <p className="text-sm text-gray-500 truncate">{follower.userDesc}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Following Modal */}
            <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
                <DialogContent className="max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle className="text-xl font-bold">Following</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto flex-1">
                        {loadingFollowing ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        ) : following.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500">Not following anyone yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {following.map((user) => (
                                    <button
                                        key={user._id}
                                        onClick={() => handleUserClick(user._id)}
                                        className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.userImg} alt={user.userName} />
                                            <AvatarFallback>{user.userName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{user.userName}</p>
                                            {user.userDesc && (
                                                <p className="text-sm text-gray-500 truncate">{user.userDesc}</p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
