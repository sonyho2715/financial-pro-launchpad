'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { WealthProSheet, IncomeProtectionCard, BusinessProtectionCard } from '@/components/balance-sheet';
import { calculatePersonalFNA } from '@/lib/calculations/personal-finance';
import { calculateBusinessFNA, calculateBusinessProtectionSummary } from '@/lib/calculations/business-finance';
import { calculateIncomeProtection } from '@/lib/calculations/protection-gap';
import type { BalanceSheetData } from '@/lib/calculations/types';

export default function BalanceSheetResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<BalanceSheetData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('balanceSheetData');
    if (!stored) {
      router.push('/dashboard/balance-sheet');
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  const personalAnalysis = useMemo(() => {
    if (!data || data.formType === 'business') return null;
    return calculatePersonalFNA(data);
  }, [data]);

  const businessAnalysis = useMemo(() => {
    if (!data || data.formType !== 'business') return null;
    return calculateBusinessFNA(data);
  }, [data]);

  const incomeProtection = useMemo(() => {
    if (!data || data.formType === 'business') return null;
    return calculateIncomeProtection(data);
  }, [data]);

  const businessProtection = useMemo(() => {
    if (!data || data.formType !== 'business') return null;
    return calculateBusinessProtectionSummary(data);
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPersonal = data.formType !== 'business';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/dashboard/balance-sheet')}
          className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isPersonal ? 'Personal' : 'Business'} Analysis Results
          </h1>
          <p className="text-gray-400 text-sm">
            {data.firstName}{data.lastName ? ` ${data.lastName}` : ''}{data.businessName ? ` - ${data.businessName}` : ''}
          </p>
        </div>
      </div>

      {/* WealthProSheet */}
      {isPersonal && personalAnalysis && (
        <WealthProSheet type="personal" analysis={personalAnalysis} firstName={data.firstName} />
      )}
      {!isPersonal && businessAnalysis && (
        <WealthProSheet type="business" analysis={businessAnalysis} firstName={data.firstName} businessName={data.businessName} />
      )}

      {/* Phase 2: Protection Deep Dive */}
      {isPersonal && incomeProtection && (
        <IncomeProtectionCard analysis={incomeProtection} firstName={data.firstName} />
      )}
      {!isPersonal && businessProtection && (
        <BusinessProtectionCard summary={businessProtection} businessName={data.businessName} />
      )}
    </div>
  );
}
