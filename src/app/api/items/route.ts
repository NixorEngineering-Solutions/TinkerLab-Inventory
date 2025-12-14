import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { name: 'asc' }
    });
    
    // Add a cache-busting header so you see updates immediately
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error("Items Load Error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}