import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 如果访问根路径，重定向到 /homepage
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/homepage', request.url))
    }

    return NextResponse.next()
}

// 配置 matcher - 只在根路径执行中间件
export const config = {
    matcher: '/',
}
