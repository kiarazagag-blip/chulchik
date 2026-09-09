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

    const body = await request.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing required field: eventId" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const userId = session.user.id;

    const attendance = await prisma.eventAttendance.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      update: {
        status: "ATTENDED",
      },
      create: {
        eventId,
        userId,
        status: "ATTENDED",
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    console.error("Error marking event attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
