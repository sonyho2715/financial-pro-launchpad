'use client';

import { useState } from 'react';
import { X, Mail, Phone, CheckCircle, BookOpen, FileText, Gift, ArrowRight, Sparkles } from 'lucide-react';

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-md w-full p-10 text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-semibold text-gray-900 mb-3">Check Your Email</h3>
          <p className="text-gray-600 mb-8 text-lg">
            We've sent your personalized report to <strong className="text-gray-900">{email}</strong>
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            <p className="text-sm font-medium text-gray-900 mb-4">What you'll receive:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                Your personalized results report
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                </div>
                First 3 chapters of the book (FREE)
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 text-amber-600" />
                </div>
                Exclusive action templates
              </li>
            </ul>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-full transition-all"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden animate-fade-in shadow-2xl">
        {/* Header */}
        <div className="relative bg-gray-900 px-8 py-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition p-1"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold">{getTitle()}</h2>
          </div>
          <p className="text-gray-400">{getDescription()}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* What they get */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <p className="text-sm font-medium text-gray-900 mb-3">You'll receive:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Detailed analysis and action steps
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                First 3 chapters of the book (FREE)
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Templates and scripts to use today
              </li>
            </ul>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Phone Input (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(808) 555-0123"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-full transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gray-900/20"
          >
            {status === 'loading' ? (
              'Sending...'
            ) : (
              <>
                Get My Free Report
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
