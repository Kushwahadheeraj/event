 'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = "An unknown error occurred.";

  switch (error) {
    case "OAuthSignIn":
      errorMessage = "There was an issue signing in with your OAuth account. Please try signing in with a different account.";
      break;
    case "Callback":
      errorMessage = "There was an error with the callback URL. Please try again.";
      break;
    case "CredentialsSignIn":
      errorMessage = "Sign in failed. Check the details you provided.";
      break;
    case "Default":
      errorMessage = "Something went wrong. Please try again.";
      break;
    default:
      errorMessage = "An unexpected error occurred. Please try again.";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Authentication Error</h2>
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
} 