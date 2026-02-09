'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface LeadCaptureBalanceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: { firstName: string; lastName: string; email: string; phone?: string }) => void;
  agentCode?: string;
}

export default function LeadCaptureBalanceSheet({ isOpen, onClose, onCapture, agentCode }: LeadCaptureBalanceSheetProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/public/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          agentCode,
          source: 'BALANCE_SHEET_PUBLIC',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit');
        return;
      }

      onCapture({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
      });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Unlock Your Full Analysis</h2>
          <p className="text-sm text-gray-400 mt-1">Enter your details to see your complete financial picture.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input type="text" required placeholder="First name" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <input type="text" required placeholder="Last name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>

          <input type="email" required placeholder="Email address" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />

          <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors">
            {loading ? 'Submitting...' : 'Get My Full Analysis'}
          </button>
        </form>
      </div>
    </div>
  );
}
