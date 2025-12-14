import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure you are using your singleton

export async function GET(
  request: Request,
  // 1. Update the Type: params is now a Promise
  { params }: { params: Promise<{ barcode: string }> } 
) {
  try {
    // 2. Await the params before using them (CRITICAL FIX)
    const { barcode } = await params;

    console.log("🔍 Scanning for barcode:", barcode);

    const user = await prisma.users.findUnique({
      where: { barcode: barcode },
    });

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json(
        { error: "Student not found. Please register first." }, 
        { status: 404 }
      );
    }
    
    // Check verification status
    if (!user.verified) {
      console.log("⚠️ User found but NOT verified");
      return NextResponse.json(
        { error: "Student exists but is NOT verified by Admin." }, 
        { status: 403 }
      );
    }

    console.log("✅ User verified, returning data.");
    return NextResponse.json(user);

  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}