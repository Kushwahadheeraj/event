import { authOptions } from "@/app/auth/[...nextauth]/route"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: eventId } = params
  const userId = session.user.id

  try {
    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (existingRsvp) {
      return NextResponse.json({ message: "Already RSVP'd to this event" }, { status: 409 })
    }

    const newRsvp = await prisma.rSVP.create({
      data: {
        userId,
        eventId,
      },
    })

    return NextResponse.json(newRsvp, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to create RSVP" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id: eventId } = params
  const userId = session.user.id

  try {
    const existingRsvp = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (!existingRsvp) {
      return NextResponse.json({ message: "RSVP not found" }, { status: 404 })
    }

    await prisma.rSVP.delete({
      where: {
        id: existingRsvp.id,
      },
    })

    return NextResponse.json({ message: "RSVP deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to delete RSVP" }, { status: 500 })
  }
} 