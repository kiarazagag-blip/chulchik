import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = new Date();

    // Check if user already has an open check-in (no checkOut)
    const openCheckin = await prisma.officeAttendance.findFirst({
      where: {
        userId,
        checkOut: null,
      },
    });

    if (openCheckin) {
      return NextResponse.json(
        { error: "You already have an open check-in. Please check out first." },
        { status: 400 }
      );
    }

    const attendance = await prisma.officeAttendance.create({
      data: {
        userId,
        date: now,
        checkIn: now,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error("Error checking in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
