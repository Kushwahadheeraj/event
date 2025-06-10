'use client';

import React from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function HeroSection() {
  const { status } = useSession();

  if (status === "authenticated") {
    return null; // Don't show hero section if authenticated
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0"></div>
      <div className="relative z-10 text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down">
          Welcome to Event Planner
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-10 opacity-0 animate-fade-in delay-200">
          Discover, create, and manage amazing events with ease.
        </p>
        <button
          onClick={() => signIn("google")}
          className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 opacity-0 animate-fade-in delay-400"
        >
          Get Started - Sign in with Google
        </button>
      </div>
    </div>
  );
} 