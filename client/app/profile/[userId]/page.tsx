"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { getUserProfile, getFollowers, getFollowing, type FollowUser } from "@/api/user";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorDialog } from "@/components/dialogs/error-dialog";
import { dateFormat } from "@/lib/date";
import { BlogCardHorizontal } from "@/components/blog/blog-card-horizontal";
import { Blog, getBlogsByUserId } from "@/api/blog";
import { Post, getUserPostsApi } from "@/api/post";
import PostCardCompact from "@/components/post/post-card-compact";
import PostDetailDialog from "@/components/post/post-detail-dialog";

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    const { user, isAuthenticated } = useAuth();
    const { showError } = useErrorDialog();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Followers/Following modal state
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followers, setFollowers] = useState<FollowUser[]>([]);
    const [following, setFollowing] = useState<FollowUser[]>([]);
    const [loadingFollowers, setLoadingFollowers] = useState(false);
    const [loadingFollowing, setLoadingFollowing] = useState(false);
    const [loadingContent, setLoadingContent] = useState(false);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [showPostDetail, setShowPostDetail] = useState(false);

    useEffect(() => {
        if (userId) {
            loadProfile();
            loadContent();
        }
    }, [userId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await getUserProfile(userId);

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

    const loadContent = async () => {
        try {
            setLoadingContent(true);
            
            // Load blogs
            const blogsResponse = await getBlogsByUserId(userId, 1, 50);
            if (blogsResponse.code === 200) {
                setBlogs(blogsResponse.data.blogs);
            }

            // Load posts
            const postsResponse = await getUserPostsApi(userId, 1, 50);
            if (postsResponse.code === 200) {
                setPosts(postsResponse.data.posts);
            }
        } catch (error) {
            console.error("Failed to load content:", error);
        } finally {
            setLoadingContent(false);
        }
    };

    const loadFollowers = async () => {
        try {
            setLoadingFollowers(true);
            const response = await getFollowers(userId, 1, 100);

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
            const response = await getFollowing(userId, 1, 100);

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

    const handleUserClick = (clickedUserId: string) => {
        router.push(`/profile/${clickedUserId}`);
        setShowFollowersModal(false);
        setShowFollowingModal(false);
    };

    // Check if current user is viewing their own profile
    const isOwnProfile = user?.id === userId;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">Profile not found</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-cream">
                <div className="max-w-[600px] mx-auto border-x border-gray-200 min-h-screen">
                    {/* Back Button */}
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="font-bold text-xl">{profile.userName}</h2>
                            <p className="text-sm text-gray-500">@{profile.account}</p>
                        </div>
                    </div>

                    {/* Header Banner */}
                    <div className="relative">
                        {profile.userBanner ? (
                            <div
                                className="h-[200px] bg-cover bg-center"
                                style={{ backgroundImage: `url(${profile.userBanner})` }}
                            ></div>
                        ) : (
                            <div className="h-[200px] bg-gradient-to-r from-blue-400 to-purple-500"></div>
                        )}

                        {/* Avatar */}
                        <div className="absolute -bottom-16 left-4">
                            <Avatar className="h-32 w-32 border-4 border-white">
                                <AvatarImage
                                    src={profile.userImg}
                                    alt={profile.userName}
                                    sizes="128px"
                                    quality={95}
                                    priority
                                />
                                <AvatarFallback className="text-4xl bg-gray-200">{profile.userName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Edit Profile Button - Only show if viewing own profile
                        {isOwnProfile && (
                            <div className="absolute top-4 right-4">
                                <Button
                                    onClick={() => router.push("/profile/edit")}
                                    variant="outline"
                                    className="rounded-full font-semibold bg-white hover:bg-gray-100 border-gray-300"
                                    size="sm"
                                >
                                    Edit profile
                                </Button>
                            </div>
                        )} */}
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
                        <div className="flex gap-5 text-sm">
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
                    </div>

                    {/* Tabs Section (Placeholder for future) */}
                    <div className="border-t border-gray-200 mt-4">
                        <div className="flex">
                            <button className="flex-1 py-4 text-center font-semibold border-b-2 border-gray-500 text-gray-500 hover:bg-gray-50 transition-colors">
                                Posts
                            </button>
                            {/* <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 transition-colors">
                                Replies
                            </button>
                            <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 transition-colors">
                                Likes
                            </button> */}
                        </div>
                    </div>

                    {/* Posts placeholder */}
                    <div className="">
                        <div>
                            {loadingContent ? (
                                <div className="p-12 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : (blogs.length === 0 && posts.length === 0) ? (
                                <div className="p-12 text-center text-gray-500">
                                    <p>No posts yet</p>
                                </div>
                            ) : (
                                // Combine blogs and posts, sort by createdAt
                                [...blogs.map(b => ({ ...b, itemType: 'blog' as const })), 
                                 ...posts.map(p => ({ ...p, itemType: 'post' as const }))]
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map(item => (
                                        item.itemType === 'blog' ? (
                                            <BlogCardHorizontal
                                                key={item._id}
                                                id={item._id}
                                                title={(item as any).title}
                                                content={(item as any).content}
                                                coverImage={item.images?.[0]}
                                                author={{
                                                    id: typeof (item as any).userId === 'string' ? (item as any).userId : (item as any).userId._id,
                                                    name: item.userName,
                                                    avatar: item.userImg
                                                }}
                                                createdAt={item.createdAt}
                                                likes={item.likes?.length || 0}
                                                comments={(item as any).comments?.length || 0}
                                            />
                                        ) : (
                                            <div key={item._id} className="mb-6">
                                                <PostCardCompact 
                                                    post={{
                                                        _id: item._id,
                                                        content: (item as any).content,
                                                        userName: item.userName,
                                                        userImg: item.userImg,
                                                        userId: typeof (item as any).userId === 'string' ? (item as any).userId : (item as any).userId?._id || '',
                                                        images: item.images || [],
                                                        likes: item.likes || [],
                                                        comments: (item as any).comments || [],
                                                        createdAt: item.createdAt,
                                                        views: (item as any).views || 0
                                                    }}
                                                    onClick={(postId) => {
                                                        setSelectedPostId(postId)
                                                        setShowPostDetail(true)
                                                    }}
                                                    onDeleted={(postId) => {
                                                        setPosts(posts.filter(p => p._id !== postId))
                                                    }}
                                                />
                                            </div>
                                        )
                                    ))
                            )}
                        </div>
                    </div>

                    {/* Post Detail Dialog */}
                    {selectedPostId && (
                        <PostDetailDialog
                            open={showPostDetail}
                            onOpenChange={setShowPostDetail}
                            postId={selectedPostId}
                        />
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
                                            <AvatarImage
                                                src={follower.userImg}
                                                alt={follower.userName}
                                                sizes="48px"
                                                quality={85}
                                            />
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
                                            <AvatarImage
                                                src={user.userImg}
                                                alt={user.userName}
                                                sizes="48px"
                                                quality={85}
                                            />
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
