import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const now = new Date();
    const month = parseInt(searchParams.get("month") || String(now.getMonth() + 1), 10);
    const year = parseInt(searchParams.get("year") || String(now.getFullYear()), 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: "Invalid month or year" },
        { status: 400 }
      );
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" },
    });

    // Get all office attendances for the month
    const officeAttendances = await prisma.officeAttendance.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // Get all event attendances for the month
    const eventAttendances = await prisma.eventAttendance.findMany({
      where: {
        event: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            type: true,
            isMandatory: true,
          },
        },
      },
    });

    // Get events for the month
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        _count: {
          select: { attendances: true },
        },
      },
      orderBy: { date: "asc" },
    });

    // Build per-user report
    const report = users.map((user) => {
      // Office attendance stats
      const userOfficeAttendances = officeAttendances.filter(
        (a) => a.userId === user.id
      );

      let totalOfficeHours = 0;
      const daysPresent = new Set<string>();

      for (const attendance of userOfficeAttendances) {
        const checkIn = new Date(attendance.checkIn);
        const checkOut = attendance.checkOut
          ? new Date(attendance.checkOut)
          : new Date();

        const hours =
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        totalOfficeHours += hours;

        daysPresent.add(checkIn.toISOString().split("T")[0]);
      }

      // Event attendance stats
      const userEventAttendances = eventAttendances.filter(
        (a) => a.userId === user.id
      );

      const eventsAttended = userEventAttendances.filter(
        (a) => a.status === "ATTENDED"
      ).length;

      const mandatoryEventsAttended = userEventAttendances.filter(
        (a) => a.status === "ATTENDED" && a.event.isMandatory
      ).length;

      const totalMandatoryEvents = events.filter(
        (e) => e.isMandatory
      ).length;

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        officeAttendance: {
          totalHours: Math.round(totalOfficeHours * 100) / 100,
          daysPresent: daysPresent.size,
        },
        eventAttendance: {
          eventsAttended,
          mandatoryEventsAttended,
          totalMandatoryEvents,
        },
      };
    });

    return NextResponse.json({
      month,
      year,
      totalEvents: events.length,
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        type: e.type,
        isMandatory: e.isMandatory,
        attendanceCount: e._count.attendances,
      })),
      members: report,
    });
  } catch (error) {
    console.error("Error generating monthly report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
