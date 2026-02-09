import type { BalanceSheetData, FNAResult } from './types';
import {
  EMERGENCY_FUND_MONTHS_TARGET,
  SAVINGS_RATE_TARGET,
  DEBT_TO_INCOME_WARNING,
  DEBT_TO_INCOME_CRITICAL,
  RETIREMENT_INCOME_REPLACEMENT,
  SAFE_WITHDRAWAL_RATE,
  ASSUMED_RETURN_RATE,
  INFLATION_RATE,
  LIFE_INSURANCE_MULTIPLE_TARGET,
  DISABILITY_REPLACEMENT_RATE,
  getGrade,
  getStatus,
} from './constants';

export function calculatePersonalFNA(data: BalanceSheetData): FNAResult {
  // Net Worth
  const netWorth = data.totalAssets - data.totalLiabilities;

  // Cash Flow
  const monthlyIncome = data.totalIncome / 12;
  const monthlyNetCashFlow = monthlyIncome - data.totalMonthlyExpenses;
  const annualNetCashFlow = monthlyNetCashFlow * 12;

  // Debt-to-Income Ratio (monthly debt payments / monthly gross income)
  const debtToIncomeRatio = monthlyIncome > 0
    ? data.debtPayments / monthlyIncome
    : 0;

  // Emergency Fund
  const emergencyFundMonths = data.totalMonthlyExpenses > 0
    ? (data.emergencyFund + data.checkingSavings) / data.totalMonthlyExpenses
    : 0;
  const emergencyFundTarget = data.totalMonthlyExpenses * EMERGENCY_FUND_MONTHS_TARGET;
  const emergencyFundGap = Math.max(0, emergencyFundTarget - (data.emergencyFund + data.checkingSavings));

  // Savings Rate
  const savingsRate = data.totalIncome > 0
    ? Math.max(0, annualNetCashFlow) / data.totalIncome
    : 0;

  // Retirement
  const yearsToRetirement = Math.max(0, data.retireAge - data.age);
  const annualRetirementNeed = data.totalIncome * RETIREMENT_INCOME_REPLACEMENT;
  const retirementTarget = annualRetirementNeed / SAFE_WITHDRAWAL_RATE;
  const currentRetirementSavings = data.retirement401k + data.rothIRA + data.brokerageAccounts;
  const realReturn = ASSUMED_RETURN_RATE - INFLATION_RATE;
  const futureValue = yearsToRetirement > 0
    ? currentRetirementSavings * Math.pow(1 + realReturn, yearsToRetirement)
    : currentRetirementSavings;
  const retirementGap = Math.max(0, retirementTarget - futureValue);

  // Category Scores (0-100 each)
  const cashFlowScore = calculateCashFlowScore(monthlyNetCashFlow, monthlyIncome);
  const protectionScore = calculateProtectionScore(data);
  const savingsScore = calculateSavingsScore(savingsRate, emergencyFundMonths);
  const debtScore = calculateDebtScore(debtToIncomeRatio);
  const retirementScore = calculateRetirementScore(futureValue, retirementTarget);

  // Overall Health Score (weighted average)
  const healthScore = Math.round(
    cashFlowScore * 0.20 +
    protectionScore * 0.25 +
    savingsScore * 0.20 +
    debtScore * 0.15 +
    retirementScore * 0.20
  );

  // Top Challenges
  const topChallenges = identifyChallenges(data, {
    cashFlowScore, protectionScore, savingsScore, debtScore, retirementScore,
    emergencyFundMonths, debtToIncomeRatio, savingsRate,
  });

  return {
    netWorth,
    monthlyNetCashFlow,
    annualNetCashFlow,
    debtToIncomeRatio,
    emergencyFundMonths,
    emergencyFundTarget,
    emergencyFundGap,
    savingsRate,
    retirementGap,
    retirementTarget,
    yearsToRetirement,
    healthScore,
    healthGrade: getGrade(healthScore),
    categories: {
      cashFlow: { score: cashFlowScore, status: getStatus(cashFlowScore) },
      protection: { score: protectionScore, status: getStatus(protectionScore) },
      savings: { score: savingsScore, status: getStatus(savingsScore) },
      debt: { score: debtScore, status: getStatus(debtScore) },
      retirement: { score: retirementScore, status: getStatus(retirementScore) },
    },
    topChallenges,
  };
}

function calculateCashFlowScore(monthlyNet: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;
  const ratio = monthlyNet / monthlyIncome;
  if (ratio >= 0.20) return 100;
  if (ratio >= 0.10) return 80;
  if (ratio >= 0.05) return 60;
  if (ratio >= 0) return 40;
  return 20; // negative cash flow
}

function calculateProtectionScore(data: BalanceSheetData): number {
  let score = 0;
  const targetLifeInsurance = data.totalIncome * LIFE_INSURANCE_MULTIPLE_TARGET;
  const targetDisability = (data.totalIncome * DISABILITY_REPLACEMENT_RATE) / 12;

  // Life insurance (0-30)
  if (targetLifeInsurance > 0) {
    const lifeRatio = Math.min(1, data.lifeInsuranceCoverage / targetLifeInsurance);
    score += lifeRatio * 30;
  } else {
    score += 30;
  }

  // Disability (0-30)
  if (targetDisability > 0) {
    const disabilityRatio = Math.min(1, data.disabilityMonthlyBenefit / targetDisability);
    score += disabilityRatio * 30;
  } else {
    score += 30;
  }

  // Estate planning (0-40): will, trust, POA, health directive
  if (data.hasWill) score += 10;
  if (data.hasTrust) score += 10;
  if (data.hasPOA) score += 10;
  if (data.hasHealthDirective) score += 10;

  return Math.round(Math.min(100, score));
}

function calculateSavingsScore(savingsRate: number, efMonths: number): number {
  let score = 0;

  // Savings rate (0-50)
  if (savingsRate >= SAVINGS_RATE_TARGET) score += 50;
  else if (savingsRate >= 0.10) score += 35;
  else if (savingsRate >= 0.05) score += 20;
  else if (savingsRate > 0) score += 10;

  // Emergency fund (0-50)
  if (efMonths >= EMERGENCY_FUND_MONTHS_TARGET) score += 50;
  else if (efMonths >= 3) score += 35;
  else if (efMonths >= 1) score += 20;
  else if (efMonths > 0) score += 10;

  return Math.round(score);
}

function calculateDebtScore(dtiRatio: number): number {
  if (dtiRatio <= 0.15) return 100;
  if (dtiRatio <= 0.25) return 80;
  if (dtiRatio <= DEBT_TO_INCOME_WARNING) return 60;
  if (dtiRatio <= DEBT_TO_INCOME_CRITICAL) return 40;
  return 20;
}

function calculateRetirementScore(futureValue: number, target: number): number {
  if (target <= 0) return 50;
  const ratio = futureValue / target;
  if (ratio >= 1.0) return 100;
  if (ratio >= 0.75) return 80;
  if (ratio >= 0.50) return 60;
  if (ratio >= 0.25) return 40;
  return 20;
}

interface ChallengeInputs {
  cashFlowScore: number;
  protectionScore: number;
  savingsScore: number;
  debtScore: number;
  retirementScore: number;
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  savingsRate: number;
}

function identifyChallenges(data: BalanceSheetData, scores: ChallengeInputs): string[] {
  const challenges: string[] = [];

  if (scores.cashFlowScore < 40) {
    challenges.push('Negative or minimal monthly cash flow limits your ability to save and invest.');
  }
  if (scores.emergencyFundMonths < 3) {
    challenges.push('Emergency fund below 3 months of expenses leaves you vulnerable to unexpected events.');
  }
  if (scores.debtToIncomeRatio > DEBT_TO_INCOME_WARNING) {
    challenges.push('High debt-to-income ratio is consuming too much of your monthly income.');
  }
  if (data.lifeInsuranceCoverage < data.totalIncome * 5 && data.dependents > 0) {
    challenges.push('Inadequate life insurance coverage could leave dependents financially vulnerable.');
  }
  if (data.disabilityMonthlyBenefit < (data.totalIncome * DISABILITY_REPLACEMENT_RATE / 12) * 0.5) {
    challenges.push('Insufficient disability coverage would severely impact income if unable to work.');
  }
  if (scores.retirementScore < 40) {
    challenges.push('Retirement savings are significantly behind target for your age and income level.');
  }
  if (scores.savingsRate < 0.05) {
    challenges.push('Very low savings rate makes it difficult to build long-term wealth.');
  }
  if (!data.hasWill && data.totalAssets > 100000) {
    challenges.push('No will or estate plan in place despite significant assets.');
  }

  return challenges.slice(0, 5); // Top 5 challenges
}
