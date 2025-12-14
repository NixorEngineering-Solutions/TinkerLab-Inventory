import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, studentId } = await req.json();

    if (!name || !studentId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.users.create({
      data: {
        student_name: name,
        student_id: studentId,
        role: "STUDENT",
        verified: false 
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Student ID already registered" }, { status: 400 });
  }
}