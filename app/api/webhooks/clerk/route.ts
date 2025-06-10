import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> Create a webhook in the webhook details
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to your .env or .env.local");
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = payload.data;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error occured -- email not found", { status: 400 });
    }

    await prisma.user.create({
      data: {
        clerkId: id,
        email: email,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
        // role: 'ATTENDEE' // Default role, or based on Clerk metadata
      },
    });

    return new Response("OK", { status: 200 });
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = payload.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response("Error occured -- email not found", { status: 400 });
    }

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
      },
    });

    return new Response("OK", { status: 200 });
  }

  if (eventType === "user.deleted") {
    const { id } = payload.data;

    await prisma.user.delete({
      where: { clerkId: id },
    });

    return new Response("OK", { status: 200 });
  }

  return new Response(""), { status: 200 };
} 