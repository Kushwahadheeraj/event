import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        owner: true,
        rsvps: {
          include: {
            user: true,
          },
        },
      },
    })
    return NextResponse.json(events, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { title, description, date, location } = await req.json()

  if (!title || !date || !location) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        ownerId: session.user.id as string,
      },
    })
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 })
  }
} 