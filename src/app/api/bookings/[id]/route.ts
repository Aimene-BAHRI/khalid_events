// src/app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.booking.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        client: true,
        user: {
          select: {
            username: true
          }
        }
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Get reservation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const reservation = await prisma.booking.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        client: true,
        user: {
          select: {
            username: true
          }
        }
      }
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Update reservation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ message: 'Reservation deleted' })
  } catch (error) {
    console.error('Delete reservation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}