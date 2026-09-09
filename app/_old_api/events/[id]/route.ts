import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, date, type, isMandatory } = body;

    if (type && !["LECTURE", "DILEMMA", "OTHER"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be LECTURE, DILEMMA, or OTHER" },
        { status: 400 }
      );
    }

    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(type !== undefined && { type }),
        ...(isMandatory !== undefined && { isMandatory }),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
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

    const { id } = await ctx.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete related attendances first
    await prisma.eventAttendance.deleteMany({
      where: { eventId: id },
    });

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
