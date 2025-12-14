import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, barcode } = await req.json();

    if (!userId || !barcode) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        barcode: barcode,
        verified: true
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Verification failed. Barcode might be in use." }, 
      { status: 400 }
    );
  }
}