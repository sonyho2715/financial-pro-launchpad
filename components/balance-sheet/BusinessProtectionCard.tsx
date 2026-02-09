'use client';

import { Building2, Users, Handshake, Banknote, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BusinessProtectionSummary } from '@/lib/calculations/types';

interface BusinessProtectionCardProps {
  summary: BusinessProtectionSummary;
  businessName?: string;
}

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function BusinessProtectionCard({ summary, businessName }: BusinessProtectionCardProps) {
  const s = summary;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-slate-900 p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Business Protection Analysis</h2>
            <p className="text-slate-400 text-sm">{businessName || 'Your Business'}</p>
          </div>
        </div>
      </div>

      {/* Valuation */}
      <div className="p-6 sm:p-8 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Business Valuation</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Conservative</p>
            <p className="text-lg font-bold text-slate-300">{formatCurrency(s.valuationLow)}</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-xs text-indigo-400 mb-1">Mid-Range</p>
            <p className="text-lg font-bold text-indigo-400">{formatCurrency(s.valuationMid)}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Optimistic</p>
            <p className="text-lg font-bold text-slate-300">{formatCurrency(s.valuationHigh)}</p>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
            EBITDA Multiple: {s.ebitdaMultiple}x
          </span>
        </div>
      </div>

      {/* Key Person Risk */}
      <div className="p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Key Person Risk</h3>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
            <svg width={80} height={80} className="-rotate-90">
              <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
              <circle cx={40} cy={40} r={32} fill="none"
                stroke={s.keyPersonGapPercent > 50 ? '#ef4444' : s.keyPersonGapPercent > 0 ? '#eab308' : '#22c55e'}
                strokeWidth={6} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 32}
                strokeDashoffset={2 * Math.PI * 32 * (s.keyPersonGapPercent / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{100 - s.keyPersonGapPercent}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Coverage Needed</span>
              <span className="text-white font-medium">{formatCurrency(s.keyPersonNeeded)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Current Coverage</span>
              <span className="text-white font-medium">{formatCurrency(s.keyPersonCurrent)}</span>
            </div>
            {s.keyPersonGapPercent > 0 ? (
              <p className="text-xs text-amber-400">
                {s.keyPersonGapPercent}% gap in key person protection
              </p>
            ) : (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Fully covered
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buy-Sell Funding */}
      <div className="p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Handshake className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Buy-Sell Funding</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Buyout Amount Needed</span>
            <span className="text-white font-medium">{formatCurrency(s.buySellNeeded)}</span>
          </div>

          {/* Horizontal bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Funded</span>
              <span>{s.buySellFundedPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  s.buySellFundedPercent >= 80 ? 'bg-green-500' :
                  s.buySellFundedPercent >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${s.buySellFundedPercent}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Current Funding</span>
            <span className={s.buySellFundedPercent >= 80 ? 'text-green-400' : 'text-amber-400'}>
              {formatCurrency(s.buySellCurrent)}
            </span>
          </div>
        </div>
      </div>

      {/* Cash Runway */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Cash Runway</h3>
        </div>

        <div className="flex items-center gap-6">
          {/* Months indicator */}
          <div className={`text-center px-6 py-4 rounded-xl border ${
            s.cashRunwayStatus === 'critical' ? 'bg-red-500/10 border-red-500/20' :
            s.cashRunwayStatus === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
            'bg-green-500/10 border-green-500/20'
          }`}>
            <p className={`text-3xl font-bold ${
              s.cashRunwayStatus === 'critical' ? 'text-red-400' :
              s.cashRunwayStatus === 'warning' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {s.cashRunwayMonths}
            </p>
            <p className="text-xs text-slate-500">months</p>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Monthly Burn Rate</span>
              <span className="text-white font-medium">{formatCurrency(s.monthlyBurn)}</span>
            </div>
            <div className="flex items-center gap-2">
              {s.cashRunwayStatus === 'critical' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Critical: Less than 3 months runway</span>
                </>
              ) : s.cashRunwayStatus === 'warning' ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Build reserves to 6+ months</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Healthy cash position</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
