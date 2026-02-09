'use client';

import { Lock } from 'lucide-react';

interface LockedSectionProps {
  title: string;
  description?: string;
  onUnlock: () => void;
  children: React.ReactNode;
}

export default function LockedSection({ title, description, onUnlock, children }: LockedSectionProps) {
  return (
    <div className="relative">
      {/* Blurred content behind */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-14 h-14 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400 mb-4">{description}</p>
          )}
          <button
            onClick={onUnlock}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Unlock Full Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
