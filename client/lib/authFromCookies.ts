// lib/auth.ts
import { getCookie } from "cookies-next";

export function getUserFromCookies(req?: any, res?: any) {
    const userCookie = getCookie("user", { req, res });
    try {
        return userCookie ? JSON.parse(userCookie as string) : null;
    } catch {
        return null;
    }
}

export function getUserTokenFromCookies(req?: any, res?: any) {
    const token = getCookie("token", { req, res });
    return token ? token : null;
}

export async function getServerSideProps({ req }: any) {
    const cookieUser = getUserFromCookies(req);
    const cookieToken = getUserTokenFromCookies(req);

    return {
        props: {
            initialUser: cookieUser || null,
            initialToken: cookieToken || "",
        }
    }
}
