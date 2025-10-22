"use client"

import {
  CompassIcon,
  FeatherIcon,
  HouseIcon,
  SearchIcon,
  Rss,
  Construction,
} from "lucide-react"
import { useState, useEffect } from "react"

import NotificationMenu from "@/components/navigation/notification-menu"
import UserProfileMenu from "@/components/navigation/user-menu"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import NaviPostButton from "@/components/navigation/post-button"
import { useAuth } from "@/contexts/AuthContext";
import User from "@/type/User";
import Signin from "@/components/auth/signin";

const navigationLinks = [
  { href: "/homepage", label: "Dashboard", icon: HouseIcon },
  { href: "/blog", label: "Blog", icon: Rss },
  { href: "#", label: "on progress...", icon: Construction },
  // { href: "#", label: "Search", icon: SearchIcon },
]

export default function Component() {

  const [loading, setLoading] = useState(true);
  const { user: userData, token: userToken, isAuthenticated } = useAuth();

  useEffect(() => {
    // 使用全局状态后，只需处理加载状态
    setLoading(false);
  }, []);

  return (
    <header className="border-b px-2 md:px-20 lg:px-60 bg-[#F7F2E8]/90 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}

        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="glass rounded-beagle-md shadow-beagle-lg border border-white/20 w-48 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                        >
                          <Icon
                            size={16}
                            className="text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {!loading && (!userToken || userToken === "") && <Signin />}

        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={link.href}
                    className="flex size-8 items-center justify-center p-1.5"
                    title={link.label}
                  >
                    <Icon aria-hidden="true" />
                    <span className="sr-only">{link.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <NaviPostButton />
          <NotificationMenu />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  )
}