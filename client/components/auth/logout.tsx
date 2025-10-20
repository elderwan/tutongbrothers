import { LogOutIcon } from "lucide-react";
import React from 'react'
import { Button } from "../ui/button";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";   // App Router
import { useSuccessDialog } from "@/components/dialogs/success-dialog";

const Logout = () => {
    const router = useRouter();
    const { showSuccess } = useSuccessDialog()

    const handleLogout = () => {
        console.log("logout clicked");
        // Clear the sign in cookies
        deleteCookie("token");
        deleteCookie("user");
        // Redirect to homepage or login page
        showSuccess({
            title: "Sign Out",
            msg: "Sign Out success!",
            onConfirm: () => {
                // use router to refresh the page
                router.refresh();
                // reload the page
                window.location.reload();
            }
        })

    };

    return (
        <Button
            onClick={handleLogout}
            className="w-full text-left text-red-600 justify-start p-0 h-auto font-normal"
            variant="ghost"
        >
            <LogOutIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
            Sign Out
        </Button>
    )
}

export default Logout