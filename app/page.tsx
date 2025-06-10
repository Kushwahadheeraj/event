'use client';

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import EventCard from "@/components/EventCard";
import EventForm from "@/components/EventForm";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface RSVP {
  id: string;
  userId: string;
  eventId: string;
  user: User;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  owner: User;
  ownerId: string;
  rsvps: RSVP[];
}

export default function Home() {
  const { data: session, status } = useSession();
  const [showEventForm, setShowEventForm] = useState(false);

  const { data: events, isLoading, error, refetch } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axios.get("/api/events");
      return data;
    },
    enabled: status === "authenticated", // Only fetch events if authenticated
  });

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  return (
    <div>
      <Navbar setShowEventForm={setShowEventForm} />
      <HeroSection />

      {status === "authenticated" && (
        <div className="min-h-screen bg-gray-100 p-8 pt-20">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-2xl">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 mt-8">Error loading events: {error.message}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {events?.map((event) => (
                <EventCard key={event.id} event={event} currentUserId={session?.user?.id} onEventUpdated={refetch} onEventDeleted={refetch} />
              ))}
            </div>
          )}
        </div>
      )}

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EventForm onClose={() => setShowEventForm(false)} onEventCreated={refetch} />
        </div>
      )}
    </div>
  );
} 