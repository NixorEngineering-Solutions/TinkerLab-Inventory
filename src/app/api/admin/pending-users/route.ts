import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 👇 ADD THIS LINE
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      where: { 
        verified: false,
        role: "STUDENT" 
      },
      select: { 
        id: true, 
        student_name: true, 
        student_id: true
      },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}