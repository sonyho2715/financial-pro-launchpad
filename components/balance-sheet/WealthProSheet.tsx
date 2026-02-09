'use client';

import { DollarSign, TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { FNAResult, BusinessFNAResult } from '@/lib/calculations/types';
import HealthScoreGauge from './HealthScoreGauge';

type WealthProSheetProps = {
  firstName?: string;
} & (
  | { type: 'personal'; analysis: FNAResult }
  | { type: 'business'; analysis: BusinessFNAResult; businessName?: string }
);

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function formatPercent(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function StatusBadge({ status }: { status: 'good' | 'warning' | 'critical' }) {
  const styles = {
    good: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const labels = { good: 'Healthy', warning: 'Needs Attention', critical: 'At Risk' };

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function WealthProSheet(props: WealthProSheetProps) {
  if (props.type === 'personal') return <PersonalSheet analysis={props.analysis} firstName={props.firstName} />;
  return <BusinessSheet analysis={props.analysis} firstName={props.firstName} businessName={props.businessName} />;
}

function PersonalSheet({ analysis, firstName }: { analysis: FNAResult; firstName?: string }) {
  const a = analysis;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 sm:p-8 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <HealthScoreGauge score={a.healthScore} grade={a.healthGrade} label="Financial Health" size="lg" />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">
              {firstName ? `${firstName}'s` : 'Your'} Financial Snapshot
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Net Worth: <span className={a.netWorth >= 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(a.netWorth)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-800">
        <MetricCell icon={DollarSign} label="Monthly Cash Flow" value={formatCurrency(a.monthlyNetCashFlow)} positive={a.monthlyNetCashFlow >= 0} />
        <MetricCell icon={Shield} label="Emergency Fund" value={`${a.emergencyFundMonths.toFixed(1)} mo`} positive={a.emergencyFundMonths >= 3} />
        <MetricCell icon={TrendingUp} label="Savings Rate" value={formatPercent(a.savingsRate)} positive={a.savingsRate >= 0.10} />
        <MetricCell icon={AlertTriangle} label="Debt-to-Income" value={formatPercent(a.debtToIncomeRatio)} positive={a.debtToIncomeRatio < 0.36} />
      </div>

      {/* Category Scores */}
      <div className="p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Category Breakdown</h3>
        <div className="space-y-3">
          <CategoryBar label="Cash Flow" score={a.categories.cashFlow.score} status={a.categories.cashFlow.status} />
          <CategoryBar label="Protection" score={a.categories.protection.score} status={a.categories.protection.status} />
          <CategoryBar label="Savings" score={a.categories.savings.score} status={a.categories.savings.status} />
          <CategoryBar label="Debt Management" score={a.categories.debt.score} status={a.categories.debt.status} />
          <CategoryBar label="Retirement" score={a.categories.retirement.score} status={a.categories.retirement.status} />
        </div>
      </div>

      {/* Challenges */}
      {a.topChallenges.length > 0 && (
        <div className="border-t border-gray-800 p-6 sm:p-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Findings</h3>
          <div className="space-y-3">
            {a.topChallenges.map((challenge, i) => (
              <div key={i} className="flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BusinessSheet({ analysis, firstName, businessName }: { analysis: BusinessFNAResult; firstName?: string; businessName?: string }) {
  const a = analysis;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-gray-900 p-6 sm:p-8 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <HealthScoreGauge score={a.healthScore} grade={a.healthGrade} label="Business Health" size="lg" />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">
              {businessName || `${firstName || 'Your'} Business`} Snapshot
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Est. Value: <span className="text-blue-400">{formatCurrency(a.valuationMid)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-800">
        <MetricCell icon={DollarSign} label="Net Worth" value={formatCurrency(a.businessNetWorth)} positive={a.businessNetWorth >= 0} />
        <MetricCell icon={TrendingUp} label="Profit Margin" value={formatPercent(a.profitMargin)} positive={a.profitMargin >= 0.10} />
        <MetricCell icon={Shield} label="Revenue/Employee" value={formatCurrency(a.revenuePerEmployee)} positive={a.revenuePerEmployee >= 100000} />
        <MetricCell icon={AlertTriangle} label="Debt-to-Equity" value={a.debtToEquityRatio.toFixed(2)} positive={a.debtToEquityRatio < 2} />
      </div>

      {/* Category Scores */}
      <div className="p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Category Breakdown</h3>
        <div className="space-y-3">
          <CategoryBar label="Profitability" score={a.categories.profitability.score} status={a.categories.profitability.status} />
          <CategoryBar label="Liquidity" score={a.categories.liquidity.score} status={a.categories.liquidity.status} />
          <CategoryBar label="Protection" score={a.categories.protection.score} status={a.categories.protection.status} />
          <CategoryBar label="Succession" score={a.categories.succession.score} status={a.categories.succession.status} />
        </div>
      </div>

      {/* Valuation */}
      <div className="border-t border-gray-800 p-6 sm:p-8">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Estimated Valuation Range</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Conservative</p>
            <p className="text-lg font-bold text-gray-300">{formatCurrency(a.valuationLow)}</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-blue-400 mb-1">Mid-Range</p>
            <p className="text-lg font-bold text-blue-400">{formatCurrency(a.valuationMid)}</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Optimistic</p>
            <p className="text-lg font-bold text-gray-300">{formatCurrency(a.valuationHigh)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">EBITDA Multiple: {a.ebitdaMultiple}x</p>
      </div>

      {/* Challenges */}
      {a.topChallenges.length > 0 && (
        <div className="border-t border-gray-800 p-6 sm:p-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Findings</h3>
          <div className="space-y-3">
            {a.topChallenges.map((challenge, i) => (
              <div key={i} className="flex gap-3 items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCell({ icon: Icon, label, value, positive }: {
  icon: React.ElementType;
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="bg-gray-900 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${positive ? 'text-white' : 'text-red-400'}`}>{value}</span>
        {positive ? (
          <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        )}
      </div>
    </div>
  );
}

function CategoryBar({ label, score, status }: { label: string; score: number; status: 'good' | 'warning' | 'critical' }) {
  const barColors = {
    good: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-300 w-32 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColors[status]} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex items-center gap-2 w-28 justify-end shrink-0">
        <span className="text-sm font-medium text-white">{score}</span>
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
