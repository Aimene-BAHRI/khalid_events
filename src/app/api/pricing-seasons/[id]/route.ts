import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const season = await prisma.pricingSeason.findUnique({
      where: { id }
    })

    if (!season) {
      return NextResponse.json(
        { error: 'Pricing season not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(season)
  } catch (error) {
    console.error('Get pricing season error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json()
    const season = await prisma.pricingSeason.update({
      where: { id },
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate)
      }
    })

    return NextResponse.json(season)
  } catch (error) {
    console.error('Update pricing season error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.pricingSeason.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Pricing season deleted' })
  } catch (error) {
    console.error('Delete pricing season error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
