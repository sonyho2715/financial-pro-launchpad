import type { BalanceSheetData, IncomeProtectionResult } from './types';
import {
  DISABILITY_REPLACEMENT_RATE,
  EMERGENCY_FUND_MONTHS_TARGET,
  getGrade,
} from './constants';

export function calculateIncomeProtection(data: BalanceSheetData): IncomeProtectionResult {
  const monthlyIncome = data.totalIncome / 12;

  // Death scenario
  const monthlyIncomeLost = monthlyIncome;
  const yearsOfIncomeNeeded = Math.max(data.retireAge - data.age, 20);
  const totalIncomeGap = monthlyIncomeLost * 12 * yearsOfIncomeNeeded;
  const lifeInsuranceCoverage = data.lifeInsuranceCoverage;
  const lifeInsuranceShortfall = Math.max(0, totalIncomeGap - lifeInsuranceCoverage);

  // Disability scenario
  const incomeReplacementTarget = monthlyIncome * DISABILITY_REPLACEMENT_RATE;
  const currentDisabilityCoverage = data.disabilityMonthlyBenefit;
  const disabilityGap = Math.max(0, incomeReplacementTarget - currentDisabilityCoverage);

  // Protection Score: 4 factors x 25 pts each
  const lifeScore = calculateLifeScore(data.lifeInsuranceCoverage, totalIncomeGap);
  const disabilityScore = calculateDisabilityScore(currentDisabilityCoverage, incomeReplacementTarget);
  const emergencyScore = calculateEmergencyScore(data);
  const estateScore = calculateEstateScore(data);

  const protectionScore = Math.round(lifeScore + disabilityScore + emergencyScore + estateScore);

  return {
    monthlyIncomeLost: Math.round(monthlyIncomeLost),
    yearsOfIncomeNeeded,
    totalIncomeGap: Math.round(totalIncomeGap),
    lifeInsuranceCoverage,
    lifeInsuranceShortfall: Math.round(lifeInsuranceShortfall),
    incomeReplacementTarget: Math.round(incomeReplacementTarget),
    currentDisabilityCoverage,
    disabilityGap: Math.round(disabilityGap),
    protectionScore,
    protectionGrade: getGrade(protectionScore),
    scoreBreakdown: {
      lifeInsurance: Math.round(lifeScore),
      disability: Math.round(disabilityScore),
      emergencyFund: Math.round(emergencyScore),
      estatePlanning: Math.round(estateScore),
    },
  };
}

function calculateLifeScore(coverage: number, totalGap: number): number {
  if (totalGap <= 0) return 25;
  const ratio = coverage / totalGap;
  if (ratio >= 1.0) return 25;
  if (ratio >= 0.75) return 20;
  if (ratio >= 0.50) return 15;
  if (ratio >= 0.25) return 10;
  if (ratio > 0) return 5;
  return 0;
}

function calculateDisabilityScore(current: number, target: number): number {
  if (target <= 0) return 25;
  const ratio = current / target;
  if (ratio >= 1.0) return 25;
  if (ratio >= 0.75) return 20;
  if (ratio >= 0.50) return 15;
  if (ratio >= 0.25) return 10;
  if (ratio > 0) return 5;
  return 0;
}

function calculateEmergencyScore(data: BalanceSheetData): number {
  const liquid = data.emergencyFund + data.checkingSavings;
  const monthlyExpenses = data.totalMonthlyExpenses;
  if (monthlyExpenses <= 0) return 25;

  const months = liquid / monthlyExpenses;
  if (months >= EMERGENCY_FUND_MONTHS_TARGET) return 25;
  if (months >= 4) return 20;
  if (months >= 3) return 15;
  if (months >= 1) return 10;
  if (months > 0) return 5;
  return 0;
}

function calculateEstateScore(data: BalanceSheetData): number {
  let score = 0;
  // 4 estate planning elements, ~6.25 pts each
  if (data.hasWill) score += 7;
  if (data.hasTrust) score += 6;
  if (data.hasPOA) score += 6;
  if (data.hasHealthDirective) score += 6;
  return Math.min(25, score);
}
