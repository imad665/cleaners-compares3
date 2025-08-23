'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'Configuration':
          setErrorMessage('There is a problem with the server configuration.');
          break;
        case 'AccessDenied':
          setErrorMessage('You do not have permission to sign in.');
          break;
        case 'Verification':
          setErrorMessage('The verification link was invalid or has expired.');
          break;
        case 'OAuthAccountNotLinked':
          setErrorMessage('This email is already associated with another account.');
          break;
        default:
          setErrorMessage('An unknown error occurred during authentication.');
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-4 text-center text-sm text-red-600">
            {errorMessage}
          </p>
          {error && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Error code: {error}
            </p>
          )}
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
          <Link
            href="/auth/signin"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}