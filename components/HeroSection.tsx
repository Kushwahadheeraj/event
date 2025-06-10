'use client';

import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const { status } = useSession();

  if (status === "authenticated") {
    return null;
  }

  return (
    <section className="bg-white py-20 md:py-32 lg:py-40 relative overflow-hidden dark:bg-gray-900">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6">
            Host, Connect, <br />Celebrate: Your <br />Events, Our <br />Platform!
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto lg:mx-0">
            Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community.
          </p>
          <Button
            onClick={() => signIn("google")}
            className="border border-gray-300 bg-white text-gray-700 font-bold py-2 px-4 rounded-md shadow-sm transition duration-300 hover:bg-gray-100"
          >
            Explore Now
          </Button>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center lg:justify-end items-center lg:items-end space-y-2">
          <p className="text-xl font-semibold text-gray-800 dark:text-white">Hero image</p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
            <p className="text-gray-600 dark:text-gray-300">Top Left Image</p>
            <p className="text-gray-600 dark:text-gray-300">Top Right Image</p>
            <p className="text-gray-600 dark:text-gray-300">Bottom Left Image</p>
            <p className="text-gray-600 dark:text-gray-300">Bottom Right Image</p>
          </div>
        </div>
      </div>
    </section>
  );
} 