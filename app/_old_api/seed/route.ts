import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return NextResponse.json(
        { error: "Database already has users. Seed is not allowed." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@hub.com",
        password: hashedPassword,
        role: "ADMIN",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Admin user created successfully", user: admin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
