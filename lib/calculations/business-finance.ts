import type { BalanceSheetData, BusinessFNAResult, BusinessProtectionSummary } from './types';
import { INDUSTRY_MULTIPLIERS, getGrade, getStatus } from './constants';

export function calculateBusinessFNA(data: BalanceSheetData): BusinessFNAResult {
  const revenue = data.annualRevenue ?? 0;
  const expenses = data.annualExpenses ?? 0;
  const netProfit = data.netProfit ?? (revenue - expenses);
  const assets = data.businessAssets ?? 0;
  const liabilities = data.businessLiabilities ?? 0;
  const employees = data.numberOfEmployees ?? 1;

  const businessNetWorth = assets - liabilities;
  const profitMargin = revenue > 0 ? netProfit / revenue : 0;
  const revenuePerEmployee = employees > 0 ? revenue / employees : 0;
  const debtToEquityRatio = businessNetWorth > 0 ? liabilities / businessNetWorth : 0;

  // Valuation
  const { valuationLow, valuationMid, valuationHigh, ebitdaMultiple } = calculateBusinessValuation(data);

  // Category Scores
  const profitabilityScore = calculateProfitabilityScore(profitMargin, revenuePerEmployee);
  const liquidityScore = calculateLiquidityScore(data);
  const protectionScore = calculateBusinessProtectionScore(data, valuationMid);
  const successionScore = calculateSuccessionScore(data);

  const healthScore = Math.round(
    profitabilityScore * 0.30 +
    liquidityScore * 0.25 +
    protectionScore * 0.25 +
    successionScore * 0.20
  );

  const topChallenges = identifyBusinessChallenges(data, {
    profitMargin, profitabilityScore, liquidityScore,
    protectionScore, successionScore, debtToEquityRatio,
  });

  return {
    businessNetWorth,
    profitMargin,
    revenuePerEmployee,
    debtToEquityRatio,
    valuationLow,
    valuationMid,
    valuationHigh,
    ebitdaMultiple,
    healthScore,
    healthGrade: getGrade(healthScore),
    categories: {
      profitability: { score: profitabilityScore, status: getStatus(profitabilityScore) },
      liquidity: { score: liquidityScore, status: getStatus(liquidityScore) },
      protection: { score: protectionScore, status: getStatus(protectionScore) },
      succession: { score: successionScore, status: getStatus(successionScore) },
    },
    topChallenges,
  };
}

export function calculateBusinessValuation(data: BalanceSheetData): {
  valuationLow: number;
  valuationMid: number;
  valuationHigh: number;
  ebitdaMultiple: number;
} {
  const revenue = data.annualRevenue ?? 0;
  const expenses = data.annualExpenses ?? 0;
  const netProfit = data.netProfit ?? (revenue - expenses);
  const assets = data.businessAssets ?? 0;
  const liabilities = data.businessLiabilities ?? 0;
  const industry = data.industry ?? 'other';

  const multipliers = INDUSTRY_MULTIPLIERS[industry] ?? INDUSTRY_MULTIPLIERS['other'];
  const netAssets = assets - liabilities;
  const ebitda = netProfit * 1.15; // approximate EBITDA from net profit

  const revenueValuation = revenue * multipliers.revenue;
  const ebitdaValuation = ebitda * multipliers.ebitda;
  const assetValuation = netAssets;

  const valuationLow = Math.max(0, netAssets);
  const valuationHigh = Math.max(revenueValuation, ebitdaValuation, assetValuation);
  const valuationMid = Math.round((valuationLow + revenueValuation + ebitdaValuation) / 3);

  return {
    valuationLow: Math.round(valuationLow),
    valuationMid: Math.round(Math.max(0, valuationMid)),
    valuationHigh: Math.round(Math.max(0, valuationHigh)),
    ebitdaMultiple: multipliers.ebitda,
  };
}

export function calculateBusinessProtectionSummary(data: BalanceSheetData): BusinessProtectionSummary {
  const { valuationLow, valuationMid, valuationHigh, ebitdaMultiple } = calculateBusinessValuation(data);
  const ownershipPct = (data.ownershipPercentage ?? 100) / 100;

  // Key Person
  const keyPersonNeeded = Math.round(valuationMid * 0.5);
  const keyPersonCurrent = data.keyPersonInsurance ?? 0;
  const keyPersonGapPercent = keyPersonNeeded > 0
    ? Math.round(Math.max(0, 1 - keyPersonCurrent / keyPersonNeeded) * 100)
    : 0;

  // Buy-Sell
  const buySellNeeded = Math.round(valuationMid * ownershipPct);
  const buySellCurrent = data.buySellFunding ?? 0;
  const buySellFundedPercent = buySellNeeded > 0
    ? Math.round(Math.min(100, (buySellCurrent / buySellNeeded) * 100))
    : 100;

  // Cash Runway
  const monthlyBurn = data.monthlyOperatingExpenses ?? ((data.annualExpenses ?? 0) / 12);
  const cashOnHand = data.businessCashOnHand ?? 0;
  const cashRunwayMonths = monthlyBurn > 0 ? Math.round((cashOnHand / monthlyBurn) * 10) / 10 : null;

  let cashRunwayStatus: 'critical' | 'warning' | 'healthy';
  if (cashRunwayMonths === null || cashRunwayMonths >= 6) cashRunwayStatus = 'healthy';
  else if (cashRunwayMonths < 3) cashRunwayStatus = 'critical';
  else cashRunwayStatus = 'warning';

  return {
    valuationLow,
    valuationMid,
    valuationHigh,
    ebitdaMultiple,
    keyPersonNeeded,
    keyPersonCurrent,
    keyPersonGapPercent,
    buySellNeeded,
    buySellCurrent,
    buySellFundedPercent,
    cashRunwayMonths,
    cashRunwayStatus,
    monthlyBurn: Math.round(monthlyBurn),
  };
}

function calculateProfitabilityScore(margin: number, revenuePerEmp: number): number {
  let score = 0;

  // Profit margin (0-60)
  if (margin >= 0.20) score += 60;
  else if (margin >= 0.10) score += 45;
  else if (margin >= 0.05) score += 30;
  else if (margin > 0) score += 15;

  // Revenue per employee (0-40)
  if (revenuePerEmp >= 200000) score += 40;
  else if (revenuePerEmp >= 150000) score += 30;
  else if (revenuePerEmp >= 100000) score += 20;
  else if (revenuePerEmp > 0) score += 10;

  return Math.round(score);
}

function calculateLiquidityScore(data: BalanceSheetData): number {
  const cash = data.businessCashOnHand ?? 0;
  const monthly = data.monthlyOperatingExpenses ?? ((data.annualExpenses ?? 0) / 12);
  const months = monthly > 0 ? cash / monthly : 0;

  if (months >= 6) return 100;
  if (months >= 3) return 70;
  if (months >= 1) return 40;
  return 20;
}

function calculateBusinessProtectionScore(data: BalanceSheetData, valuation: number): number {
  let score = 0;

  // Key person insurance (0-50)
  const keyNeeded = valuation * 0.5;
  const keyCurrent = data.keyPersonInsurance ?? 0;
  if (keyNeeded > 0) {
    score += Math.min(50, Math.round((keyCurrent / keyNeeded) * 50));
  } else {
    score += 50;
  }

  // Buy-sell funding (0-50)
  const ownerPct = (data.ownershipPercentage ?? 100) / 100;
  const bsNeeded = valuation * ownerPct;
  const bsCurrent = data.buySellFunding ?? 0;
  if (bsNeeded > 0) {
    score += Math.min(50, Math.round((bsCurrent / bsNeeded) * 50));
  } else {
    score += 50;
  }

  return Math.round(score);
}

function calculateSuccessionScore(data: BalanceSheetData): number {
  let score = 0;
  const years = data.yearsInBusiness ?? 0;

  // Years in business build urgency (0-30)
  if (years >= 10) score += 30;
  else if (years >= 5) score += 20;
  else score += 10;

  // Buy-sell funding existence (0-35)
  if ((data.buySellFunding ?? 0) > 0) score += 35;

  // Key person insurance (0-35)
  if ((data.keyPersonInsurance ?? 0) > 0) score += 35;

  return Math.round(Math.min(100, score));
}

interface BusinessChallengeInputs {
  profitMargin: number;
  profitabilityScore: number;
  liquidityScore: number;
  protectionScore: number;
  successionScore: number;
  debtToEquityRatio: number;
}

function identifyBusinessChallenges(data: BalanceSheetData, scores: BusinessChallengeInputs): string[] {
  const challenges: string[] = [];

  if (scores.profitMargin < 0.05) {
    challenges.push('Thin profit margins limit your ability to reinvest and build resilience.');
  }
  if (scores.liquidityScore < 40) {
    challenges.push('Insufficient cash reserves. Less than 3 months of operating expenses on hand.');
  }
  if ((data.keyPersonInsurance ?? 0) === 0) {
    challenges.push('No key person insurance leaves the business vulnerable if a critical team member is lost.');
  }
  if ((data.buySellFunding ?? 0) === 0 && (data.ownershipPercentage ?? 100) < 100) {
    challenges.push('No buy-sell agreement funding could create ownership transfer problems.');
  }
  if (scores.debtToEquityRatio > 2) {
    challenges.push('High debt-to-equity ratio increases financial risk and limits borrowing capacity.');
  }
  if (scores.successionScore < 40) {
    challenges.push('Lack of succession planning puts the business at risk of disruption.');
  }

  return challenges.slice(0, 5);
}
