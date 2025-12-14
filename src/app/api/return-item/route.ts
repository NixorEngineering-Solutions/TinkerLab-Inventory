import { NextResponse } from "next/server";
import { TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma"; // <--- IMPORT FROM LIB

export async function POST(req: Request) {
  try {
    const { studentId, itemName, quantity } = await req.json();

    // 1. Validate Input
    const item = await prisma.item.findFirst({ where: { name: itemName } });
    const user = await prisma.users.findUnique({ where: { student_id: studentId } });

    if (!item || !user) {
      console.log("❌ Return Error: Invalid Item or User");
      return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    }

    // 2. Atomic Transaction
    await prisma.$transaction(async (tx) => {
      // Increment Stock
      await tx.item.update({
        where: { id: item.id },
        data: { quantity: { increment: quantity } },
      });

      // Log Return
      await tx.transaction.create({
        data: {
          student_id: user.student_id,
          student_name: user.student_name,
          type: TransactionType.RETURN,
          quantity: quantity,
          item_name: item.name,
        },
      });
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 Return Failed:", error); // Check terminal if this happens
    return NextResponse.json({ error: "Return failed" }, { status: 500 });
  }
}