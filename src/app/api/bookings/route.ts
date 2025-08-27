// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all bookings
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { client: true, user: true, payments: true },
      orderBy: { date: "asc" },
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      title: b.title,
      weddingDate: b.date,
      totalPrice: b.totalPrice,
      paidAmount: b.paidAmount,
      status: b.status,
      clientId: b.clientId,
      userId: b.userId,
      client: b.client,
      user: b.user,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load bookings" },
      { status: 500 }
    );
  }
}

// POST new booking
export async function POST(request: NextRequest) {
  try {
    // For now, assume userId is sent from frontend
    // In future, get from auth/session

    const body = await request.json();
    const {
      clientId,
      date,
      timeSlot,
      status,
      totalPrice,
      paidAmount,
      notes,
      userId, // 👈 temporary, to be removed
    } = body;

    // ✅ Parse date
    const parsedDate = date ? new Date(date) : null;
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date provided" },
        { status: 400 }
      );
    }

    // ✅ Ensure numbers
    const parsedTotal = parseFloat(totalPrice);
    const parsedPaid = parseFloat(paidAmount);

    // ✅ Create booking (foreign keys as strings)
    const booking = await prisma.booking.create({
      data: {
        clientId,
        date: parsedDate,
        timeSlot,
        status,
        totalPrice: parsedTotal,
        paidAmount: parsedPaid,
        notes,
        userId, // 👈 take from session, not frontend
      },
      include: { client: true, user: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




// PATCH update booking
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...updates,
        date: updates.date ? new Date(updates.date) : undefined,
      },
      include: { client: true, user: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE booking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing booking id" }, { status: 400 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
