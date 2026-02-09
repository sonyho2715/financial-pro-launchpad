'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const STEPS = ['Personal Info', 'Income & Expenses', 'Assets & Debts', 'Protection', 'Referrals', 'Review'];

const initialData = {
  firstName: '', lastName: '', age: 35, retireAge: 65, dependents: 0,
  annualSalary: 0, spouseIncome: 0, otherIncome: 0,
  housing: 0, utilities: 0, food: 0, transportation: 0, insurance: 0,
  healthcare: 0, debtPayments: 0, entertainment: 0, otherExpenses: 0,
  checkingSavings: 0, emergencyFund: 0, retirement401k: 0, rothIRA: 0,
  brokerageAccounts: 0, realEstateEquity: 0, otherAssets: 0,
  mortgage: 0, autoLoans: 0, studentLoans: 0, creditCards: 0, otherDebts: 0,
  lifeInsuranceCoverage: 0, disabilityMonthlyBenefit: 0,
  hasWill: false, hasTrust: false, hasPOA: false, hasHealthDirective: false,
  referral1Name: '', referral1Contact: '',
  referral2Name: '', referral2Contact: '',
  referral3Name: '', referral3Contact: '',
  referral4Name: '', referral4Contact: '',
};

type FormData = typeof initialData;

export default function PersonalBalanceSheetPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [saving, setSaving] = useState(false);

  const update = useCallback((field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const totalIncome = formData.annualSalary + formData.spouseIncome + formData.otherIncome;
  const totalMonthlyExpenses = formData.housing + formData.utilities + formData.food +
    formData.transportation + formData.insurance + formData.healthcare +
    formData.debtPayments + formData.entertainment + formData.otherExpenses;
  const totalAssets = formData.checkingSavings + formData.emergencyFund + formData.retirement401k +
    formData.rothIRA + formData.brokerageAccounts + formData.realEstateEquity + formData.otherAssets;
  const totalLiabilities = formData.mortgage + formData.autoLoans + formData.studentLoans +
    formData.creditCards + formData.otherDebts;

  async function handleSubmit() {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        formType: 'personal',
        totalIncome,
        totalMonthlyExpenses,
        totalAssets,
        totalLiabilities,
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
      <h1 className="text-2xl font-bold text-white mb-2">Personal Balance Sheet</h1>
      <p className="text-gray-400 mb-8">Complete your financial needs analysis.</p>

      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => i <= step && setStep(i)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-blue-500' : 'bg-gray-800'}`}
            title={s} />
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">{STEPS[step]}</h2>

        {step === 0 && (
          <div className="space-y-4">
            <Row><Field label="First Name" value={formData.firstName} onChange={v => update('firstName', v)} type="text" /><Field label="Last Name" value={formData.lastName} onChange={v => update('lastName', v)} type="text" /></Row>
            <Row><NumField label="Age" value={formData.age} onChange={v => update('age', v)} /><NumField label="Retirement Age" value={formData.retireAge} onChange={v => update('retireAge', v)} /></Row>
            <NumField label="Number of Dependents" value={formData.dependents} onChange={v => update('dependents', v)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Annual Income</h3>
              <div className="space-y-3">
                <CurrField label="Your Salary/Income" value={formData.annualSalary} onChange={v => update('annualSalary', v)} />
                <CurrField label="Spouse Income" value={formData.spouseIncome} onChange={v => update('spouseIncome', v)} />
                <CurrField label="Other Income" value={formData.otherIncome} onChange={v => update('otherIncome', v)} />
                <TotalLine label="Total Annual Income" value={totalIncome} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Monthly Expenses</h3>
              <div className="space-y-3">
                <CurrField label="Housing (rent/mortgage)" value={formData.housing} onChange={v => update('housing', v)} />
                <CurrField label="Utilities" value={formData.utilities} onChange={v => update('utilities', v)} />
                <CurrField label="Food/Groceries" value={formData.food} onChange={v => update('food', v)} />
                <CurrField label="Transportation" value={formData.transportation} onChange={v => update('transportation', v)} />
                <CurrField label="Insurance Premiums" value={formData.insurance} onChange={v => update('insurance', v)} />
                <CurrField label="Healthcare" value={formData.healthcare} onChange={v => update('healthcare', v)} />
                <CurrField label="Debt Payments" value={formData.debtPayments} onChange={v => update('debtPayments', v)} />
                <CurrField label="Entertainment" value={formData.entertainment} onChange={v => update('entertainment', v)} />
                <CurrField label="Other Expenses" value={formData.otherExpenses} onChange={v => update('otherExpenses', v)} />
                <TotalLine label="Total Monthly Expenses" value={totalMonthlyExpenses} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Assets</h3>
              <div className="space-y-3">
                <CurrField label="Checking/Savings" value={formData.checkingSavings} onChange={v => update('checkingSavings', v)} />
                <CurrField label="Emergency Fund" value={formData.emergencyFund} onChange={v => update('emergencyFund', v)} />
                <CurrField label="401(k)/403(b)" value={formData.retirement401k} onChange={v => update('retirement401k', v)} />
                <CurrField label="Roth IRA" value={formData.rothIRA} onChange={v => update('rothIRA', v)} />
                <CurrField label="Brokerage Accounts" value={formData.brokerageAccounts} onChange={v => update('brokerageAccounts', v)} />
                <CurrField label="Real Estate Equity" value={formData.realEstateEquity} onChange={v => update('realEstateEquity', v)} />
                <CurrField label="Other Assets" value={formData.otherAssets} onChange={v => update('otherAssets', v)} />
                <TotalLine label="Total Assets" value={totalAssets} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Liabilities</h3>
              <div className="space-y-3">
                <CurrField label="Mortgage Balance" value={formData.mortgage} onChange={v => update('mortgage', v)} />
                <CurrField label="Auto Loans" value={formData.autoLoans} onChange={v => update('autoLoans', v)} />
                <CurrField label="Student Loans" value={formData.studentLoans} onChange={v => update('studentLoans', v)} />
                <CurrField label="Credit Cards" value={formData.creditCards} onChange={v => update('creditCards', v)} />
                <CurrField label="Other Debts" value={formData.otherDebts} onChange={v => update('otherDebts', v)} />
                <TotalLine label="Total Liabilities" value={totalLiabilities} />
              </div>
            </div>
            <TotalLine label="Net Worth" value={totalAssets - totalLiabilities} highlight />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Insurance Coverage</h3>
              <div className="space-y-3">
                <CurrField label="Life Insurance (death benefit)" value={formData.lifeInsuranceCoverage} onChange={v => update('lifeInsuranceCoverage', v)} />
                <CurrField label="Disability (monthly benefit)" value={formData.disabilityMonthlyBenefit} onChange={v => update('disabilityMonthlyBenefit', v)} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Estate Planning</h3>
              <div className="space-y-3">
                <Toggle label="Do you have a Will?" value={formData.hasWill} onChange={v => update('hasWill', v)} />
                <Toggle label="Do you have a Trust?" value={formData.hasTrust} onChange={v => update('hasTrust', v)} />
                <Toggle label="Power of Attorney?" value={formData.hasPOA} onChange={v => update('hasPOA', v)} />
                <Toggle label="Healthcare Directive?" value={formData.hasHealthDirective} onChange={v => update('hasHealthDirective', v)} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-400">Know someone who could benefit from a financial analysis? Share their info and we&apos;ll reach out.</p>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-800/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-300">Referral {i}</p>
                <Row>
                  <Field label="Name" value={String(formData[`referral${i}Name` as keyof FormData] || '')} onChange={v => update(`referral${i}Name` as keyof FormData, v)} type="text" />
                  <Field label="Phone or Email" value={String(formData[`referral${i}Contact` as keyof FormData] || '')} onChange={v => update(`referral${i}Contact` as keyof FormData, v)} type="text" />
                </Row>
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <ReviewItem label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <ReviewItem label="Age / Retire" value={`${formData.age} / ${formData.retireAge}`} />
            <ReviewItem label="Total Income" value={`$${totalIncome.toLocaleString()}/yr`} />
            <ReviewItem label="Monthly Expenses" value={`$${totalMonthlyExpenses.toLocaleString()}/mo`} />
            <ReviewItem label="Total Assets" value={`$${totalAssets.toLocaleString()}`} />
            <ReviewItem label="Total Liabilities" value={`$${totalLiabilities.toLocaleString()}`} />
            <ReviewItem label="Net Worth" value={`$${(totalAssets - totalLiabilities).toLocaleString()}`} />
            <ReviewItem label="Life Insurance" value={`$${formData.lifeInsuranceCoverage.toLocaleString()}`} />
            <ReviewItem label="Disability" value={`$${formData.disabilityMonthlyBenefit.toLocaleString()}/mo`} />
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
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-colors">
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

// Form field components
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="number" value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-7 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );
}

function TotalLine({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between pt-3 border-t border-gray-700 ${highlight ? 'mt-4 pt-4' : ''}`}>
      <span className={`text-sm font-medium ${highlight ? 'text-white' : 'text-gray-300'}`}>{label}</span>
      <span className={`text-sm font-bold ${value >= 0 ? (highlight ? 'text-green-400' : 'text-white') : 'text-red-400'}`}>
        ${Math.abs(value).toLocaleString()}{value < 0 && ' (deficit)'}
      </span>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-700 hover:border-gray-600 transition-colors">
      <span className="text-sm text-gray-300">{label}</span>
      <div className={`w-10 h-6 rounded-full transition-colors relative ${value ? 'bg-green-500' : 'bg-gray-600'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${value ? 'left-5' : 'left-1'}`} />
      </div>
    </button>
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
