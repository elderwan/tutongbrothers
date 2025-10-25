import React from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useSuccessDialog } from "@/components/dialogs/success-dialog";
import SigninDialog from "@/components/auth/signin-dialog";
import PostTypeDialog from "@/components/post/post-type-dialog";
import CreatePostDialog from "@/components/post/create-post-dialog";
import { useAuth } from '@/contexts/AuthContext';

const NaviPostButton = () => {
    const { isAuthenticated } = useAuth();
    const [showSignIn, setShowSignIn] = useState(false);
    const [showPostType, setShowPostType] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);

    const { showSuccess } = useSuccessDialog();

    const handlePostClick = () => {
        if (!isAuthenticated) {
            showSuccess({
                title: "Sign in required",
                msg: "Sign in then post your fantasy!",
                onConfirm: () => {
                    setShowSignIn(true);
                }
            });
        } else {
            setShowPostType(true);
        }
    };

    const handleTypeSelect = (type: 'blog' | 'post') => {
        if (type === 'blog') {
            window.location.href = "/post";
        } else {
            setShowCreatePost(true);
        }
    };

    const handlePostCreated = () => {
        // Refresh the page to show the new post
        window.location.reload();
    };

    return (
        <>
            <Button onClick={handlePostClick} size="sm" className="text-sm max-sm:aspect-square max-sm:p-0">
                <PlusIcon
                    className="opacity-60 sm:-ms-1"
                    size={16}
                    aria-hidden="true"
                />
                <span className="max-sm:sr-only">Post</span>
            </Button>

            <SigninDialog
                open={showSignIn}
                onOpenChange={setShowSignIn}
            />

            <PostTypeDialog
                open={showPostType}
                onOpenChange={setShowPostType}
                onSelectType={handleTypeSelect}
            />

            <CreatePostDialog
                open={showCreatePost}
                onOpenChange={setShowCreatePost}
                onPostCreated={handlePostCreated}
            />
        </>
    )
}

export default NaviPostButton