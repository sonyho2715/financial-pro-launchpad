'use client';

import { useMemo, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { WealthProSheet, LockedSection, IncomeProtectionCard, BusinessProtectionCard, LeadCaptureBalanceSheet } from '@/components/balance-sheet';
import { calculatePersonalFNA } from '@/lib/calculations/personal-finance';
import { calculateBusinessFNA, calculateBusinessProtectionSummary } from '@/lib/calculations/business-finance';
import { calculateIncomeProtection } from '@/lib/calculations/protection-gap';
import type { BalanceSheetData } from '@/lib/calculations/types';

export default function PublicResultsPage({ params }: { params: Promise<{ agentCode: string }> }) {
  const { agentCode } = use(params);
  const router = useRouter();
  const [data, setData] = useState<BalanceSheetData | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showCapture, setShowCapture] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('balanceSheetData');
    if (!stored) {
      router.push(`/b/${agentCode}`);
      return;
    }
    setData(JSON.parse(stored));
  }, [router, agentCode]);

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

  function handleUnlock() {
    setShowCapture(true);
  }

  function handleCapture() {
    setUnlocked(true);
    setShowCapture(false);
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPersonal = data.formType !== 'business';

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(`/b/${agentCode}`)}
            className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Your {isPersonal ? 'Financial' : 'Business'} Analysis
            </h1>
            <p className="text-gray-400 text-sm">
              {data.firstName}{data.lastName ? ` ${data.lastName}` : ''}
            </p>
          </div>
        </div>

        {/* WealthProSheet - always visible */}
        {isPersonal && personalAnalysis && (
          <WealthProSheet type="personal" analysis={personalAnalysis} firstName={data.firstName} />
        )}
        {!isPersonal && businessAnalysis && (
          <WealthProSheet type="business" analysis={businessAnalysis} firstName={data.firstName} businessName={data.businessName} />
        )}

        {/* Phase 2: Protection Deep Dive - LOCKED on public page */}
        {isPersonal && incomeProtection && (
          unlocked ? (
            <IncomeProtectionCard analysis={incomeProtection} firstName={data.firstName} />
          ) : (
            <LockedSection
              title="Income Protection Analysis"
              description="See what happens to your income if you can't work. Enter your details to unlock."
              onUnlock={handleUnlock}
            >
              <IncomeProtectionCard analysis={incomeProtection} firstName={data.firstName} />
            </LockedSection>
          )
        )}

        {!isPersonal && businessProtection && (
          unlocked ? (
            <BusinessProtectionCard summary={businessProtection} businessName={data.businessName} />
          ) : (
            <LockedSection
              title="Business Protection Analysis"
              description="Unlock your full business valuation, key person risk, and cash runway analysis."
              onUnlock={handleUnlock}
            >
              <BusinessProtectionCard summary={businessProtection} businessName={data.businessName} />
            </LockedSection>
          )
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureBalanceSheet
        isOpen={showCapture}
        onClose={() => setShowCapture(false)}
        onCapture={handleCapture}
        agentCode={agentCode}
      />
    </div>
  );
}
