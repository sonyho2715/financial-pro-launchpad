'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, ArrowRight, Info } from 'lucide-react';
import { calculateIncome, type IncomeInputs, type IncomeResults, type ProductType } from '@/lib/calculations';

interface IncomeCalculatorProps {
  onComplete?: (results: IncomeResults, inputs: IncomeInputs) => void;
}

const PRODUCTS: { value: ProductType; label: string; description: string }[] = [
  { value: 'term_life', label: 'Term Life', description: 'High volume, steady commissions' },
  { value: 'permanent_life', label: 'Permanent Life', description: 'Higher premiums, larger cases' },
  { value: 'annuity', label: 'Annuity', description: 'Investment-focused clients' },
  { value: 'medicare', label: 'Medicare', description: 'Flat fee per policy' },
];

export default function IncomeCalculator({ onComplete }: IncomeCalculatorProps) {
  const [inputs, setInputs] = useState<IncomeInputs>({
    productType: 'term_life',
    callsPerWeek: 25,
    appointmentRate: 30,
    closeRate: 35,
    avgPremium: 1200,
  });

  const results = useMemo(() => calculateIncome(inputs), [inputs]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleGetReport = () => {
    if (onComplete) {
      onComplete(results, inputs);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Income Calculator</h2>
            <p className="text-gray-500">Based on real commission rates</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Inputs Column */}
        <div className="p-8 space-y-8">
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Product Focus
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PRODUCTS.map((product) => (
                <button
                  key={product.value}
                  onClick={() => setInputs({ ...inputs, productType: product.value })}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                    inputs.productType === product.value
                      ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-[1.02]'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="font-medium">{product.label}</div>
                  <div className={`text-xs mt-1 ${
                    inputs.productType === product.value ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {product.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calls Per Week */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-900">
                Calls per Week
              </label>
              <span className="text-3xl font-semibold text-gray-900 tabular-nums">{inputs.callsPerWeek}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={inputs.callsPerWeek}
              onChange={(e) => setInputs({ ...inputs, callsPerWeek: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          {/* Appointment Rate */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-900">
                Appointment Rate
              </label>
              <span className="text-3xl font-semibold text-gray-900 tabular-nums">{inputs.appointmentRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={inputs.appointmentRate}
              onChange={(e) => setInputs({ ...inputs, appointmentRate: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Close Rate */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-900">
                Close Rate
              </label>
              <span className="text-3xl font-semibold text-gray-900 tabular-nums">{inputs.closeRate}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              value={inputs.closeRate}
              onChange={(e) => setInputs({ ...inputs, closeRate: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>15%</span>
              <span>60%</span>
            </div>
          </div>

          {/* Average Premium */}
          {inputs.productType !== 'medicare' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-gray-900">
                  Average Annual Premium
                </label>
                <span className="text-3xl font-semibold text-gray-900 tabular-nums">{formatCurrency(inputs.avgPremium)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={inputs.avgPremium}
                onChange={(e) => setInputs({ ...inputs, avgPremium: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="p-8 bg-gray-50/50">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
            Your Projected Income
          </h3>

          {/* Primary Result */}
          <div className="bg-white rounded-3xl p-8 mb-6 border border-gray-100 shadow-sm">
            <div className="text-sm text-gray-500 mb-3">Year 1 Annual Income</div>
            <div className="text-5xl md:text-6xl font-semibold text-gray-900 mb-2 tracking-tight">
              {formatCurrency(results.annualTotal)}
            </div>
            <div className="text-lg text-gray-500">
              {formatCurrency(results.monthlyTotal)} / month
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                <DollarSign className="w-4 h-4" />
                First Year Commission
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {formatCurrency(results.monthlyFYC)}
              </div>
              <div className="text-sm text-gray-400">per month</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                <TrendingUp className="w-4 h-4" />
                Renewals
              </div>
              <div className="text-2xl font-semibold text-gray-900">
                {formatCurrency(results.monthlyRenewals)}
              </div>
              <div className="text-sm text-gray-400">per month</div>
            </div>
          </div>

          {/* Future Projections */}
          <div className="bg-gray-900 rounded-3xl p-6 text-white mb-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-5">
              <Target className="w-4 h-4" />
              Growth Projections
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-gray-500 text-sm mb-1">Year 3</div>
                <div className="text-3xl md:text-4xl font-semibold tracking-tight">{formatCurrency(results.year3Projection)}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm mb-1">Year 5</div>
                <div className="text-3xl md:text-4xl font-semibold tracking-tight">{formatCurrency(results.year5Projection)}</div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-blue-50 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <strong>Your Activity:</strong> {inputs.callsPerWeek} calls/week → {Math.round(inputs.callsPerWeek * (inputs.appointmentRate / 100))} appointments → {Math.round(inputs.callsPerWeek * (inputs.appointmentRate / 100) * (inputs.closeRate / 100))} sales/week
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetReport}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-gray-900/20"
          >
            Get Your Full Report
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-gray-500 text-center">
          Based on industry-average commission rates. Actual results vary by carrier, state, and individual performance.
        </p>
      </div>
    </div>
  );
}
