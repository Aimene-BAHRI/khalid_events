// src/app/api/pricing-seasons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const seasons = await prisma.pricingSeason.findMany({
      orderBy: { startDate: 'asc' }
    })
    return NextResponse.json(seasons)
  } catch (error) {
    console.error('Get pricing seasons error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, startDate, endDate, morningPrice, eveningPrice, isActive } = await request.json()

    const season = await prisma.pricingSeason.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        morningPrice: parseFloat(morningPrice),
        eveningPrice: parseFloat(eveningPrice),
        isActive: Boolean(isActive)
      }
    })

    return NextResponse.json(season)
  } catch (error) {
    console.error('Create pricing season error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}