import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma"; // <--- IMPORT FROM LIB (The Singleton)

// Prepare the secret for 'jose' library
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function POST(req: Request) {
  try {
    const { student_id, password } = await req.json();

    console.log(`🔐 Attempting login for: ${student_id}`);

    // 1. Find the user
    const user = await prisma.users.findUnique({
      where: { student_id },
    });

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "Invalid Admin Credentials" }, { status: 401 });
    }

    // 2. Check if they are actually an ADMIN
    if (user.role !== "ADMIN") {
      console.log(`❌ User ${user.student_name} is not an ADMIN`);
      return NextResponse.json({ error: "Access Restricted to Admins" }, { status: 403 });
    }

    // 3. Verify Password
    if (!user.password) {
      console.log("❌ Admin has no password set");
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      console.log("❌ Incorrect password");
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    console.log("✅ Password verified, generating token...");

    // 4. Create JWT (using jose)
    const token = await new SignJWT({ 
      id: user.student_id, 
      role: user.role, 
      name: user.student_name 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // 5. Set Cookie & Return Success
    const response = NextResponse.json({ success: true });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    console.error("🔥 Login Error:", error); // Check your terminal for this!
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}