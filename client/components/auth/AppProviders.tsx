"use client"
import { useEffect } from "react";
import { useAuthDialog } from "@/contexts/AuthDialogContext";
import { setLoginDialogHandler } from "@/lib/Axios";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    const { openSignIn } = useAuthDialog();

    useEffect(() => {
        setLoginDialogHandler(openSignIn);
    }, [openSignIn]);

    return <>{children}</>;
};
