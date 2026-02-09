// ──────────────────────────────────────────────
// Financial Planning Constants
// ──────────────────────────────────────────────

export const EMERGENCY_FUND_MONTHS_TARGET = 6;
export const SAVINGS_RATE_TARGET = 0.20; // 20% of gross income
export const DEBT_TO_INCOME_WARNING = 0.36;
export const DEBT_TO_INCOME_CRITICAL = 0.50;

// Retirement
export const RETIREMENT_INCOME_REPLACEMENT = 0.80; // 80% of pre-retirement income
export const SAFE_WITHDRAWAL_RATE = 0.04; // 4% rule
export const ASSUMED_RETURN_RATE = 0.07; // 7% nominal
export const INFLATION_RATE = 0.03;

// Life insurance rule of thumb: 10-15x income
export const LIFE_INSURANCE_MULTIPLE_MIN = 10;
export const LIFE_INSURANCE_MULTIPLE_TARGET = 12;

// Disability: 60% of gross income
export const DISABILITY_REPLACEMENT_RATE = 0.60;

// ──────────────────────────────────────────────
// Business Valuation Industry Multipliers
// ──────────────────────────────────────────────

export const INDUSTRY_MULTIPLIERS: Record<string, { revenue: number; ebitda: number }> = {
  'financial_services': { revenue: 2.5, ebitda: 8.0 },
  'insurance': { revenue: 2.0, ebitda: 7.0 },
  'real_estate': { revenue: 1.8, ebitda: 6.5 },
  'healthcare': { revenue: 2.2, ebitda: 9.0 },
  'technology': { revenue: 3.5, ebitda: 12.0 },
  'retail': { revenue: 0.8, ebitda: 4.0 },
  'restaurant': { revenue: 0.5, ebitda: 3.5 },
  'construction': { revenue: 0.7, ebitda: 4.5 },
  'manufacturing': { revenue: 1.0, ebitda: 5.0 },
  'professional_services': { revenue: 1.5, ebitda: 6.0 },
  'other': { revenue: 1.2, ebitda: 5.0 },
};

// ──────────────────────────────────────────────
// Score thresholds
// ──────────────────────────────────────────────

export function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function getStatus(score: number): 'good' | 'warning' | 'critical' {
  if (score >= 70) return 'good';
  if (score >= 40) return 'warning';
  return 'critical';
}
