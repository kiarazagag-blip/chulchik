import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Calculate the start of the current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Get office attendance for this week
    const officeAttendances = await prisma.officeAttendance.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
    });

    // Calculate total hours
    let totalHours = 0;
    const daysPresent = new Set<string>();

    for (const attendance of officeAttendances) {
      const checkIn = new Date(attendance.checkIn);
      const checkOut = attendance.checkOut
        ? new Date(attendance.checkOut)
        : now;

      const hours =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
      totalHours += hours;

      // Track unique days
      daysPresent.add(checkIn.toISOString().split("T")[0]);
    }

    // Get event attendance for this week
    const eventsAttended = await prisma.eventAttendance.count({
      where: {
        userId,
        status: "ATTENDED",
        event: {
          date: {
            gte: startOfWeek,
            lt: endOfWeek,
          },
        },
      },
    });

    // Check if currently checked in
    const currentCheckin = await prisma.officeAttendance.findFirst({
      where: {
        userId,
        checkOut: null,
      },
    });

    return NextResponse.json({
      totalHours: Math.round(totalHours * 100) / 100,
      daysPresent: daysPresent.size,
      eventsAttended,
      isCheckedIn: !!currentCheckin,
      currentCheckIn: currentCheckin?.checkIn || null,
      weekStart: startOfWeek.toISOString(),
      weekEnd: endOfWeek.toISOString(),
    });
  } catch (error) {
    console.error("Error getting attendance status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
