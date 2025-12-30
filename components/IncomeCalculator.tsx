'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, Phone, Target } from 'lucide-react';
import {
  calculateIncome,
  DEFAULT_INPUTS,
  PRODUCT_LABELS,
  type ProductType,
  type IncomeInputs,
  type IncomeResults,
} from '@/lib/calculations';

interface IncomeCalculatorProps {
  onComplete?: (results: IncomeResults, inputs: IncomeInputs) => void;
}

export default function IncomeCalculator({ onComplete }: IncomeCalculatorProps) {
  const [productType, setProductType] = useState<ProductType>('term_life');
  const [inputs, setInputs] = useState<IncomeInputs>({
    productType: 'term_life',
    ...DEFAULT_INPUTS.term_life,
  });
  const [results, setResults] = useState<IncomeResults | null>(null);

  // Update inputs when product type changes
  useEffect(() => {
    const newInputs = {
      productType,
      ...DEFAULT_INPUTS[productType],
    };
    setInputs(newInputs);
  }, [productType]);

  // Calculate results whenever inputs change
  useEffect(() => {
    const newResults = calculateIncome(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (field: keyof IncomeInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGetReport = () => {
    if (results && onComplete) {
      onComplete(results, inputs);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Insurance Income Calculator</h2>
        </div>
        <p className="text-blue-100">See realistic income based on your activity level</p>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Left Column - Inputs */}
        <div className="p-6 border-r border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Your Activity
          </h3>

          {/* Product Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Focus
            </label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as ProductType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {Object.entries(PRODUCT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Calls Per Week */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Prospecting Calls Per Week: <span className="text-blue-600 font-bold">{inputs.callsPerWeek}</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={inputs.callsPerWeek}
              onChange={(e) => handleInputChange('callsPerWeek', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10</span>
              <span>100</span>
            </div>
          </div>

          {/* Appointment Rate */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Appointment Rate: <span className="text-blue-600 font-bold">{inputs.appointmentRate}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={inputs.appointmentRate}
              onChange={(e) => handleInputChange('appointmentRate', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Close Rate */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Close Rate: <span className="text-blue-600 font-bold">{inputs.closeRate}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="70"
              value={inputs.closeRate}
              onChange={(e) => handleInputChange('closeRate', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>70%</span>
            </div>
          </div>

          {/* Average Premium (not for Medicare) */}
          {productType !== 'medicare' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Avg {productType === 'annuity' ? 'Deposit' : 'Annual Premium'}: <span className="text-blue-600 font-bold">{formatCurrency(inputs.avgPremium)}</span>
              </label>
              <input
                type="range"
                min={productType === 'annuity' ? 10000 : 600}
                max={productType === 'annuity' ? 200000 : 12000}
                step={productType === 'annuity' ? 5000 : 100}
                value={inputs.avgPremium}
                onChange={(e) => handleInputChange('avgPremium', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatCurrency(productType === 'annuity' ? 10000 : 600)}</span>
                <span>{formatCurrency(productType === 'annuity' ? 200000 : 12000)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Your Projected Income
          </h3>

          {results && (
            <>
              {/* Activity Summary */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Monthly Activity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {results.monthlyPolicies} policies/month
                </p>
                <p className="text-sm text-gray-500">
                  {results.policiesPerYear} policies/year
                </p>
              </div>

              {/* Income Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 mb-4 text-white shadow-lg">
                <p className="text-sm text-green-100 mb-1">Year 1 Monthly Income</p>
                <p className="text-4xl font-bold mb-2">
                  {formatCurrency(results.monthlyTotal)}
                </p>
                <p className="text-sm text-green-100">
                  First-year commission: {formatCurrency(results.monthlyFYC)}/mo
                </p>
              </div>

              {/* Projections */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Year 1 Total</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(results.annualTotal)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Year 3 (w/ renewals)</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(results.year3Projection)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-100 rounded-lg p-4 mb-6">
                <p className="text-xs text-blue-800 mb-1">Year 5 Projection</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(results.year5Projection)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  With compounding renewals from client retention
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleGetReport}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Get Your Full Report
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Includes action steps to hit these numbers
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Based on industry-average commission rates. Actual results vary by carrier, state, and individual performance.
          This calculator assumes you're keeping 100% of your commission (no splits to upline).
        </p>
      </div>
    </div>
  );
}
