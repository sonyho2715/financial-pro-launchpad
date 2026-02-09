'use client';

import { Shield, HeartPulse, Landmark, FileText } from 'lucide-react';
import type { IncomeProtectionResult } from '@/lib/calculations/types';
import HealthScoreGauge from './HealthScoreGauge';

interface IncomeProtectionCardProps {
  analysis: IncomeProtectionResult;
  firstName?: string;
}

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default function IncomeProtectionCard({ analysis, firstName }: IncomeProtectionCardProps) {
  const a = analysis;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header with Protection Score */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <HealthScoreGauge
            score={a.protectionScore}
            grade={a.protectionGrade}
            label="Protection Score"
            size="lg"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">
              Income Protection Analysis
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              What happens if {firstName || 'you'} can&apos;t work?
            </p>
          </div>
        </div>
      </div>

      {/* Death Scenario */}
      <div className="p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            If {firstName || 'You'} Pass Away
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Monthly Income Lost</p>
            <p className="text-lg font-bold text-white">{formatCurrency(a.monthlyIncomeLost)}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Years of Income Needed</p>
            <p className="text-lg font-bold text-white">{a.yearsOfIncomeNeeded} yrs</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Income Gap</span>
            <span className="text-sm font-medium text-white">{formatCurrency(a.totalIncomeGap)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Life Insurance Coverage</span>
            <span className="text-sm font-medium text-green-400">{formatCurrency(a.lifeInsuranceCoverage)}</span>
          </div>

          {a.lifeInsuranceShortfall > 0 ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-400">Coverage Shortfall</span>
                <span className="text-lg font-bold text-red-400">{formatCurrency(a.lifeInsuranceShortfall)}</span>
              </div>
              <p className="text-xs text-red-400/70 mt-1">
                Your family would have a {formatCurrency(a.lifeInsuranceShortfall)} gap in income replacement.
              </p>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Life insurance coverage is adequate</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disability Scenario */}
      <div className="p-6 sm:p-8 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <HeartPulse className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            If {firstName || 'You'} Become Disabled
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Monthly Income Target (60%)</span>
            <span className="text-sm font-medium text-white">{formatCurrency(a.incomeReplacementTarget)}/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Current Disability Coverage</span>
            <span className="text-sm font-medium text-white">{formatCurrency(a.currentDisabilityCoverage)}/mo</span>
          </div>

          {a.disabilityGap > 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-amber-400">Monthly Gap</span>
                <span className="text-lg font-bold text-amber-400">{formatCurrency(a.disabilityGap)}/mo</span>
              </div>
              <p className="text-xs text-amber-400/70 mt-1">
                You&apos;d be short {formatCurrency(a.disabilityGap)} per month if disabled.
              </p>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Disability coverage meets target</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-6 sm:p-8">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Score Breakdown</h3>
        <div className="space-y-3">
          <ScoreBar icon={Shield} label="Life Insurance" score={a.scoreBreakdown.lifeInsurance} max={25} />
          <ScoreBar icon={HeartPulse} label="Disability" score={a.scoreBreakdown.disability} max={25} />
          <ScoreBar icon={Landmark} label="Emergency Fund" score={a.scoreBreakdown.emergencyFund} max={25} />
          <ScoreBar icon={FileText} label="Estate Planning" score={a.scoreBreakdown.estatePlanning} max={25} />
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ icon: Icon, label, score, max }: {
  icon: React.ElementType;
  label: string;
  score: number;
  max: number;
}) {
  const pct = (score / max) * 100;
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
      <span className="text-sm text-slate-300 w-28 shrink-0">{label}</span>
      <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium text-slate-300 w-12 text-right">{score}/{max}</span>
    </div>
  );
}
