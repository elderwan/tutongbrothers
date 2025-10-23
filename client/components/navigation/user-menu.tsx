import { useState, useEffect } from "react"
import Image from "next/image"
import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  LogIn,
  PinIcon,
  UserPenIcon,
} from "lucide-react"



import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUserFromCookies } from "@/lib/authFromCookies";
import User from "@/type/User";
import Logout from "@/components/auth/logout";
import Signin from "@/components/auth/signin";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


export default function UserProfileMenu() {

  const router = useRouter();

  const { user } = useAuth();
  const { token } = useAuth();

  const userData = user as User;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.userName) {
      return userData.userName.substring(0, 2).toUpperCase();
    }
    return "TT";
  };

  // If user is not logged in, show sign in option
  if (!userData) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
            <Avatar>
              <AvatarImage
                src="https://res.cloudinary.com/dewxaup4t/image/upload/v1758264535/profile-user_vzeotq.png"
                alt="Profile image"
                sizes="32px"
                quality={90}
                priority={true}
              />
              <AvatarFallback>TT</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64 bg-cream" align="end">
          <div className="p-4 text-center">
            <div className="text-lg font-semibold mb-1">You are not sign in yet.</div>
            <div className="text-sm text-muted-foreground mb-4">Sign in to see more</div>
            <div className="w-full flex justify-center items-center">
              <Signin />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user is logged in, show user profile menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage
              src={userData?.userImg || "https://res.cloudinary.com/dewxaup4t/image/upload/v1758264535/profile-user_vzeotq.png"}
              alt="Profile image"
              sizes="32px"
              quality={90}
              priority={true}
            />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-cream" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {userData?.userName || "Unknown User"}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {userData?.userEmail || "No email"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Layers2Icon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookOpenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 3</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            <PinIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Option 4</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" aria-hidden="true" />
            <span onClick={() => router.push(`/profile`)}>profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}