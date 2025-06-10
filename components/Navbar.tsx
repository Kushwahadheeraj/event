'use client';

import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from '@/components/ui/button';

interface NavbarProps {
  setShowEventForm: (show: boolean) => void;
}

export default function Navbar({ setShowEventForm }: NavbarProps) {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center fixed w-full top-0 z-10 dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        <Image src="/assets/images/logo.svg" alt="eventlify logo" width={20} height={20} className="mr-1" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">eventlify</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </Button>
        {status === "authenticated" ? (
          <>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Hello, {session?.user?.name || session?.user?.email}</p>
            <Button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
            >
              Sign out
            </Button>
            <Button
              onClick={() => setShowEventForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300"
            >
              Create New Event
            </Button>
          </>
        ) : (
          <Button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <span role="img" aria-label="moon">🌙</span> Login
          </Button>
        )}
      </div>
    </nav>
  );
} 