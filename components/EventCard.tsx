'use client';

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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

interface EventCardProps {
  event: Event;
  currentUserId: string | undefined;
  onEventUpdated: () => void;
  onEventDeleted: () => void;
}

export default function EventCard({
  event,
  currentUserId,
  onEventUpdated,
  onEventDeleted,
}: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);
  const [editedDescription, setEditedDescription] = useState(event.description);
  const [editedDate, setEditedDate] = useState(event.date.substring(0, 16));
  const [editedLocation, setEditedLocation] = useState(event.location);
  const isOwner = currentUserId === event.ownerId;
  const hasRsvpd = event.rsvps.some((rsvp) => rsvp.userId === currentUserId);

  const handleRSVP = async () => {
    try {
      if (hasRsvpd) {
        await axios.delete(`/api/events/${event.id}/rsvp`);
        toast.success("RSVP cancelled!");
      } else {
        await axios.post(`/api/events/${event.id}/rsvp`);
        toast.success("RSVP successful!");
      }
      onEventUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to RSVP");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/events/${event.id}`, {
        title: editedTitle,
        description: editedDescription,
        date: editedDate,
        location: editedLocation,
      });
      toast.success("Event updated successfully!");
      setIsEditing(false);
      onEventUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update event");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/api/events/${event.id}`);
        toast.success("Event deleted successfully!");
        onEventDeleted();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Event Title"
          />
          <textarea
            value={editedDescription || ""}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Event Description"
          />
          <input
            type="datetime-local"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Event Location"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
          <p className="text-gray-700 mb-2">{event.description}</p>
          <p className="text-gray-600 text-sm mb-1"><strong>Date:</strong> {formatDate(event.date)}</p>
          <p className="text-gray-600 text-sm mb-4"><strong>Location:</strong> {event.location}</p>
          <p className="text-gray-500 text-xs mt-auto">Created by: {event.owner.name || event.owner.email}</p>
          <p className="text-gray-500 text-xs">RSVPs: {event.rsvps.length}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {event.rsvps.map((rsvp) => (
              <span key={rsvp.id} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {rsvp.user.name || rsvp.user.email}
              </span>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleRSVP}
              className={`py-2 px-4 rounded-md shadow-sm transition duration-300 ${hasRsvpd ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"} text-white font-semibold`}
            >
              {hasRsvpd ? "Cancel RSVP" : "RSVP"}
            </button>
            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
} 