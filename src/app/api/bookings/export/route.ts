import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Parser } from "json2csv";

// GET: export bookings as CSV
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { client: true, user: true, payments: true },
      orderBy: { date: "asc" },
    });

    // Flatten data for CSV
    const csvData = bookings.map((b) => ({
      bookingId: b.id,
      title: b.title || "",
      weddingDate: b.date.toISOString(),
      timeSlot: b.timeSlot,
      status: b.status,
      totalPrice: b.totalPrice,
      paidAmount: b.paidAmount,
      clientName: b.client.fullName,
      clientEmail: b.client.email || "",
      clientPhone: b.client.phoneNumber,
      staff: b.user.username,
      payments: b.payments
        .map((p) => `${p.amount} (${p.method}, ${p.type})`)
        .join("; "),
    }));

    // Convert JSON to CSV
    const parser = new Parser();
    const csv = parser.parse(csvData);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bookings.csv"`,
      },
    });
  } catch (error) {
    console.error("Export CSV error:", error);
    return NextResponse.json(
      { error: "Failed to export bookings" },
      { status: 500 }
    );
  }
}
