'use client';

import { useState } from 'react';
import { X, Mail, Phone, CheckCircle, BookOpen, FileText, Gift } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: 'income_calculator' | 'recruiting_mill_quiz';
  resultData?: Record<string, unknown>;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  source,
  resultData,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone: phone || null,
          source,
          resultData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const getTitle = () => {
    if (source === 'income_calculator') {
      return 'Get Your Income Report';
    }
    return 'Get Your Free Resources';
  };

  const getDescription = () => {
    if (source === 'income_calculator') {
      return 'We\'ll send you a detailed breakdown plus action steps to hit your income goals.';
    }
    return 'Get personalized recommendations and free chapters from the book.';
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h3>
          <p className="text-gray-600 mb-6">
            We've sent your personalized report and free resources to <strong>{email}</strong>
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-blue-900 mb-2">What you'll receive:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Your personalized results report
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                First 3 chapters of the book (FREE)
              </li>
              <li className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Exclusive action templates
              </li>
            </ul>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-8 h-8" />
            <h2 className="text-xl font-bold">{getTitle()}</h2>
          </div>
          <p className="text-amber-100 text-sm">{getDescription()}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* What they get */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">You'll receive:</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Detailed analysis and action steps
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                First 3 chapters of the book (FREE)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Templates and scripts to use today
              </li>
            </ul>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
          </div>

          {/* Phone Input (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(808) 555-0123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
            />
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {status === 'loading' ? 'Sending...' : 'Get My Free Report'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
