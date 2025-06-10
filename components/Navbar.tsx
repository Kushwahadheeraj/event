'use client';

import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

interface NavbarProps {
  setShowEventForm: (show: boolean) => void;
}

export default function Navbar({ setShowEventForm }: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center fixed w-full top-0 z-10">
      <h1 className="text-2xl font-bold text-gray-800">Event App</h1>
      <div className="flex items-center space-x-4">
        {status === "authenticated" ? (
          <>
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
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
} 