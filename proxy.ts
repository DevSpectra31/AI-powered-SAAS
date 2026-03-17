import { clerkMiddleware, createRouteMatcher  } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    './',
    '/sign-in',
    '/sign-up',
])

const isPublicAPIRoute  = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(async (auth,req)=>{
    const {userId} = await auth();
    const currentUrl=new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest=currentUrl.pathname.startsWith("/api")
    // user is logged but not in dashboard
    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL("/home",req.url))
    }
    //not logged in
    if(!userId){
        if(!isPublicAPIRoute(req) && !isPublicRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
        }
    }
    //not logged in but trying to request protected route
    if(!isPublicAPIRoute(req) && !isPublicRoute(req)){
        return NextResponse.redirect(new URL("/sign-in",req.url))
    }
    return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}