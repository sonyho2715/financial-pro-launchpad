'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const STEPS = ['Business Info', 'Revenue & Expenses', 'Assets & Liabilities', 'Protection', 'Referrals', 'Review'];

const INDUSTRIES = [
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'retail', label: 'Retail' },
  { value: 'restaurant', label: 'Restaurant/Food Service' },
  { value: 'construction', label: 'Construction' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
];

const initialData = {
  firstName: '', lastName: '', businessName: '', industry: 'other',
  numberOfEmployees: 1, ownershipPercentage: 100, yearsInBusiness: 0,
  annualRevenue: 0, annualExpenses: 0, netProfit: 0,
  businessAssets: 0, businessLiabilities: 0,
  businessCashOnHand: 0, monthlyOperatingExpenses: 0,
  keyPersonInsurance: 0, buySellFunding: 0,
  referral1Name: '', referral1Contact: '',
  referral2Name: '', referral2Contact: '',
  referral3Name: '', referral3Contact: '',
  referral4Name: '', referral4Contact: '',
};

type FormData = typeof initialData;

export default function BusinessBalanceSheetPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [saving, setSaving] = useState(false);

  const update = useCallback((field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const computedNetProfit = formData.annualRevenue - formData.annualExpenses;

  async function handleSubmit() {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        formType: 'business',
        netProfit: formData.netProfit || computedNetProfit,
        totalIncome: formData.annualRevenue,
        totalAssets: formData.businessAssets,
        totalLiabilities: formData.businessLiabilities,
        totalMonthlyExpenses: formData.monthlyOperatingExpenses,
        // Personal fields needed by types but not in business form
        age: 45, retireAge: 65, dependents: 0,
        annualSalary: 0, spouseIncome: 0, otherIncome: 0,
        housing: 0, utilities: 0, food: 0, transportation: 0,
        insurance: 0, healthcare: 0, debtPayments: 0,
        entertainment: 0, otherExpenses: 0,
        checkingSavings: 0, emergencyFund: 0, retirement401k: 0,
        rothIRA: 0, brokerageAccounts: 0, realEstateEquity: 0, otherAssets: 0,
        mortgage: 0, autoLoans: 0, studentLoans: 0, creditCards: 0, otherDebts: 0,
        lifeInsuranceCoverage: 0, disabilityMonthlyBenefit: 0,
        hasWill: false, hasTrust: false, hasPOA: false, hasHealthDirective: false,
      };

      const res = await fetch('/api/balance-sheet/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        sessionStorage.setItem('balanceSheetData', JSON.stringify(payload));
        router.push('/dashboard/balance-sheet/results');
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Business Balance Sheet</h1>
      <p className="text-gray-400 mb-8">Analyze your business financial health.</p>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => i <= step && setStep(i)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-indigo-500' : 'bg-gray-800'}`}
            title={s} />
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">{STEPS[step]}</h2>

        {step === 0 && (
          <div className="space-y-4">
            <Row><Field label="Contact First Name" value={formData.firstName} onChange={v => update('firstName', v)} /><Field label="Contact Last Name" value={formData.lastName} onChange={v => update('lastName', v)} /></Row>
            <Field label="Business Name" value={formData.businessName} onChange={v => update('businessName', v)} />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Industry</label>
              <select value={formData.industry} onChange={e => update('industry', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {INDUSTRIES.map(ind => <option key={ind.value} value={ind.value}>{ind.label}</option>)}
              </select>
            </div>
            <Row>
              <NumField label="Number of Employees" value={formData.numberOfEmployees} onChange={v => update('numberOfEmployees', v)} />
              <NumField label="Ownership %" value={formData.ownershipPercentage} onChange={v => update('ownershipPercentage', v)} />
            </Row>
            <NumField label="Years in Business" value={formData.yearsInBusiness} onChange={v => update('yearsInBusiness', v)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <CurrField label="Annual Revenue" value={formData.annualRevenue} onChange={v => update('annualRevenue', v)} />
            <CurrField label="Annual Expenses" value={formData.annualExpenses} onChange={v => update('annualExpenses', v)} />
            <CurrField label="Net Profit (or auto-calculated)" value={formData.netProfit || computedNetProfit} onChange={v => update('netProfit', v)} />
            <CurrField label="Monthly Operating Expenses" value={formData.monthlyOperatingExpenses} onChange={v => update('monthlyOperatingExpenses', v)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <CurrField label="Total Business Assets" value={formData.businessAssets} onChange={v => update('businessAssets', v)} />
            <CurrField label="Total Business Liabilities" value={formData.businessLiabilities} onChange={v => update('businessLiabilities', v)} />
            <CurrField label="Cash on Hand" value={formData.businessCashOnHand} onChange={v => update('businessCashOnHand', v)} />
            <TotalLine label="Business Net Worth" value={formData.businessAssets - formData.businessLiabilities} highlight />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <CurrField label="Key Person Insurance" value={formData.keyPersonInsurance} onChange={v => update('keyPersonInsurance', v)} />
            <CurrField label="Buy-Sell Agreement Funding" value={formData.buySellFunding} onChange={v => update('buySellFunding', v)} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">Know a business owner who could benefit from a financial analysis?</p>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-300">Referral {i}</p>
                <Row>
                  <Field label="Name" value={String(formData[`referral${i}Name` as keyof FormData] || '')} onChange={v => update(`referral${i}Name` as keyof FormData, v)} />
                  <Field label="Phone or Email" value={String(formData[`referral${i}Contact` as keyof FormData] || '')} onChange={v => update(`referral${i}Contact` as keyof FormData, v)} />
                </Row>
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <ReviewItem label="Business" value={formData.businessName || 'Not specified'} />
            <ReviewItem label="Industry" value={INDUSTRIES.find(i => i.value === formData.industry)?.label || formData.industry} />
            <ReviewItem label="Revenue" value={`$${formData.annualRevenue.toLocaleString()}/yr`} />
            <ReviewItem label="Net Profit" value={`$${(formData.netProfit || computedNetProfit).toLocaleString()}/yr`} />
            <ReviewItem label="Assets" value={`$${formData.businessAssets.toLocaleString()}`} />
            <ReviewItem label="Liabilities" value={`$${formData.businessLiabilities.toLocaleString()}`} />
            <ReviewItem label="Cash on Hand" value={`$${formData.businessCashOnHand.toLocaleString()}`} />
            <ReviewItem label="Key Person Insurance" value={`$${formData.keyPersonInsurance.toLocaleString()}`} />
            <ReviewItem label="Buy-Sell Funding" value={`$${formData.buySellFunding.toLocaleString()}`} />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-colors">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl transition-colors">
              <CheckCircle className="w-4 h-4" /> {saving ? 'Saving...' : 'Generate Analysis'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  );
}

function CurrField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-400 w-48 shrink-0">{label}</label>
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
        <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
    </div>
  );
}

function TotalLine({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between pt-3 border-t border-gray-700 ${highlight ? 'mt-4 pt-4' : ''}`}>
      <span className={`text-sm font-medium ${highlight ? 'text-white' : 'text-gray-300'}`}>{label}</span>
      <span className={`text-sm font-bold ${value >= 0 ? (highlight ? 'text-indigo-400' : 'text-white') : 'text-red-400'}`}>
        ${Math.abs(value).toLocaleString()}{value < 0 && ' (deficit)'}
      </span>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
