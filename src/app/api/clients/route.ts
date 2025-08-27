// src/app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: { bookings: true, payments: true },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load clients" }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json()

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}