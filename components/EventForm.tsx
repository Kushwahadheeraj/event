'use client';

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface EventFormProps {
  onClose: () => void;
  onEventCreated: () => void;
}

export default function EventForm({ onClose, onEventCreated }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/events", {
        title,
        description,
        date,
        location,
      });
      toast.success("Event created successfully!");
      onEventCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Event Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Describe the event"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 text-sm font-semibold mb-2">Date & Time</label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Where will the event take place?"
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-md shadow-sm transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
} 