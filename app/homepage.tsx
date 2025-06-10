'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";

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

export default function HomePage() {
  const { data: session, status } = useSession();
  const [showEventForm, setShowEventForm] = useState(false);

  const { data: events, isLoading, error, refetch } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axios.get("/api/events");
      return data;
    },
  });

  if (status === "loading" || isLoading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">Welcome to Event Management App</h1>
        <p className="text-lg mb-8">Please sign in to view and manage events.</p>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">Error loading events: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Events</h1>
        <div className="flex items-center space-x-4">
          <p className="text-lg font-medium text-gray-700">Hello, {session?.user?.name || session?.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
          >
            Sign out
          </button>
          <button
            onClick={() => setShowEventForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
          >
            Create New Event
          </button>
        </div>
      </header>

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EventForm onClose={() => setShowEventForm(false)} onEventCreated={refetch} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} currentUserId={session?.user?.id} onEventUpdated={refetch} onEventDeleted={refetch} />
        ))}
      </div>
    </div>
  );
} 