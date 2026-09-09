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

    // Find the latest open check-in
    const openCheckin = await prisma.officeAttendance.findFirst({
      where: {
        userId,
        checkOut: null,
      },
      orderBy: {
        checkIn: "desc",
      },
    });

    if (!openCheckin) {
      return NextResponse.json(
        { error: "No open check-in found. Please check in first." },
        { status: 400 }
      );
    }

    const attendance = await prisma.officeAttendance.update({
      where: { id: openCheckin.id },
      data: {
        checkOut: now,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error checking out:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
