import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, description, date, type, isMandatory } = body;

    if (!title || !date || !type) {
      return NextResponse.json(
        { error: "Missing required fields: title, date, type" },
        { status: 400 }
      );
    }

    if (!["LECTURE", "DILEMMA", "OTHER"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be LECTURE, DILEMMA, or OTHER" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date: parsedDate,
        type,
        isMandatory: isMandatory !== undefined ? isMandatory : true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let dateFilter = {};

    if (month && year) {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
        return NextResponse.json(
          { error: "Invalid month or year" },
          { status: 400 }
        );
      }

      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 1);

      dateFilter = {
        date: {
          gte: startDate,
          lt: endDate,
        },
      };
    }

    const events = await prisma.event.findMany({
      where: dateFilter,
      include: {
        attendances: {
          select: {
            id: true,
            userId: true,
            status: true,
          },
        },
        _count: {
          select: {
            attendances: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error listing events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
