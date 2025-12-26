import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; 

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
  
  // 1. Define the "Secret Key" (Must match your .env or default)
  const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret"
  );

  // 2. Define Public Paths (Anyone can visit these)
  // We include /api/login and /api/signup so the forms work!
  const isPublicPath = 
    path === "/login" || 
    path === "/signup" || 
    path.startsWith("/api/login") || 
    path.startsWith("/api/signup");

  // --- SCENARIO A: User is trying to access a Public Page ---
  if (isPublicPath) {
    // If they are ALREADY logged in as Admin, redirect them to Dashboard
    // (So they don't have to login twice)
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch (e) {
        // Token is invalid/expired, just let them stay on the public page
      }
    }
    return NextResponse.next(); // Let them proceed
  }

  // --- SCENARIO B: User is trying to access a Protected Page (Dashboard, Verify, etc.) ---
  
  // If no token exists, redirect to Signup (as per your request)
  if (!token) {
    // If it's an API call, return JSON error instead of HTML redirect
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/signup", req.url));
  }

  // If token exists, verify it's valid and they are an ADMIN
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (payload.role !== "ADMIN") {
      // User is logged in but NOT an admin? Kick them out.
      return NextResponse.redirect(new URL("/signup", req.url));
    }

    // Token is valid and role is Admin. Let them pass!
    return NextResponse.next();
    
  } catch (error) {
    // Token was fake or expired
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply this rule to all pages EXCEPT static files (images, fonts, Next.js internals)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|NES_Logo.png).*)",
  ],
};