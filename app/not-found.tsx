'use client';

import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
