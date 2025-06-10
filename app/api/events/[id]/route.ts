import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        owner: true,
        rsvps: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const { title, description, date, location } = await req.json()

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title || event.title,
        description: description || event.description,
        date: date ? new Date(date) : event.date,
        location: location || event.location,
      },
    })

    return NextResponse.json(updatedEvent, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete event" }, { status: 500 })
  }
} 