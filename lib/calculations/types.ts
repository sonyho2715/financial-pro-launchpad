// ──────────────────────────────────────────────
// Balance Sheet Data (form input structure)
// ──────────────────────────────────────────────

export interface BalanceSheetData {
  // Personal Info
  firstName: string;
  lastName: string;
  age: number;
  retireAge: number;
  dependents: number;
  formType: 'personal' | 'business';

  // Income
  annualSalary: number;
  spouseIncome: number;
  otherIncome: number;
  totalIncome: number;

  // Monthly Expenses
  housing: number;
  utilities: number;
  food: number;
  transportation: number;
  insurance: number;
  healthcare: number;
  debtPayments: number;
  entertainment: number;
  otherExpenses: number;
  totalMonthlyExpenses: number;

  // Assets
  checkingSavings: number;
  emergencyFund: number;
  retirement401k: number;
  rothIRA: number;
  brokerageAccounts: number;
  realEstateEquity: number;
  otherAssets: number;
  totalAssets: number;

  // Liabilities
  mortgage: number;
  autoLoans: number;
  studentLoans: number;
  creditCards: number;
  otherDebts: number;
  totalLiabilities: number;

  // Protection / Insurance
  lifeInsuranceCoverage: number;
  disabilityMonthlyBenefit: number;
  hasWill: boolean;
  hasTrust: boolean;
  hasPOA: boolean;
  hasHealthDirective: boolean;

  // Business-specific fields
  businessName?: string;
  industry?: string;
  annualRevenue?: number;
  annualExpenses?: number;
  netProfit?: number;
  businessAssets?: number;
  businessLiabilities?: number;
  numberOfEmployees?: number;
  ownershipPercentage?: number;
  yearsInBusiness?: number;
  keyPersonInsurance?: number;
  buySellFunding?: number;
  businessCashOnHand?: number;
  monthlyOperatingExpenses?: number;

  // Referrals
  referral1Name?: string;
  referral1Contact?: string;
  referral2Name?: string;
  referral2Contact?: string;
  referral3Name?: string;
  referral3Contact?: string;
  referral4Name?: string;
  referral4Contact?: string;
}

// ──────────────────────────────────────────────
// FNA (Financial Needs Analysis) Result
// ──────────────────────────────────────────────

export interface FNAResult {
  netWorth: number;
  monthlyNetCashFlow: number;
  annualNetCashFlow: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  emergencyFundTarget: number;
  emergencyFundGap: number;
  savingsRate: number;
  retirementGap: number;
  retirementTarget: number;
  yearsToRetirement: number;
  healthScore: number; // 0-100
  healthGrade: string; // A-F

  // Category scores
  categories: {
    cashFlow: { score: number; status: 'good' | 'warning' | 'critical' };
    protection: { score: number; status: 'good' | 'warning' | 'critical' };
    savings: { score: number; status: 'good' | 'warning' | 'critical' };
    debt: { score: number; status: 'good' | 'warning' | 'critical' };
    retirement: { score: number; status: 'good' | 'warning' | 'critical' };
  };

  // Cause of financial challenges
  topChallenges: string[];
}

// ──────────────────────────────────────────────
// Business FNA Result
// ──────────────────────────────────────────────

export interface BusinessFNAResult {
  businessNetWorth: number;
  profitMargin: number;
  revenuePerEmployee: number;
  debtToEquityRatio: number;

  // Valuation
  valuationLow: number;
  valuationMid: number;
  valuationHigh: number;
  ebitdaMultiple: number;

  // Health
  healthScore: number;
  healthGrade: string;

  categories: {
    profitability: { score: number; status: 'good' | 'warning' | 'critical' };
    liquidity: { score: number; status: 'good' | 'warning' | 'critical' };
    protection: { score: number; status: 'good' | 'warning' | 'critical' };
    succession: { score: number; status: 'good' | 'warning' | 'critical' };
  };

  topChallenges: string[];
}

// ──────────────────────────────────────────────
// Phase 2: Income Protection Result
// ──────────────────────────────────────────────

export interface IncomeProtectionResult {
  monthlyIncomeLost: number;
  yearsOfIncomeNeeded: number;
  totalIncomeGap: number;
  lifeInsuranceCoverage: number;
  lifeInsuranceShortfall: number;
  incomeReplacementTarget: number;  // 60% of monthly income
  currentDisabilityCoverage: number;
  disabilityGap: number;
  protectionScore: number;           // 0-100
  protectionGrade: string;           // A-F
  scoreBreakdown: {
    lifeInsurance: number;           // 0-25
    disability: number;              // 0-25
    emergencyFund: number;           // 0-25
    estatePlanning: number;          // 0-25
  };
}

// ──────────────────────────────────────────────
// Phase 2: Business Protection Summary
// ──────────────────────────────────────────────

export interface BusinessProtectionSummary {
  valuationLow: number;
  valuationMid: number;
  valuationHigh: number;
  ebitdaMultiple: number;
  keyPersonNeeded: number;
  keyPersonCurrent: number;
  keyPersonGapPercent: number;
  buySellNeeded: number;
  buySellCurrent: number;
  buySellFundedPercent: number;
  cashRunwayMonths: number;
  cashRunwayStatus: 'critical' | 'warning' | 'healthy';
  monthlyBurn: number;
}
