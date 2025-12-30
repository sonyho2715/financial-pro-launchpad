// Insurance Income Calculator Logic
// Based on realistic commission structures from the Hawaii Financial Professional's Blueprint

export type ProductType = 'term_life' | 'permanent_life' | 'annuity' | 'medicare';

export interface IncomeInputs {
  productType: ProductType;
  callsPerWeek: number;
  appointmentRate: number; // % of calls that become appointments
  closeRate: number; // % of appointments that close
  avgPremium: number; // Average annual premium
}

export interface IncomeResults {
  monthlyPolicies: number;
  monthlyFYC: number;
  monthlyRenewals: number;
  monthlyTotal: number;
  annualTotal: number;
  year3Projection: number;
  year5Projection: number;
  policiesPerYear: number;
}

// Commission rates by product type (realistic industry averages)
const COMMISSION_RATES: Record<ProductType, { fyc: number; renewal: number; avgPremium: number }> = {
  term_life: {
    fyc: 0.70,      // 70% first-year commission
    renewal: 0.05,  // 5% renewal years 2-10
    avgPremium: 1200 // $100/mo average
  },
  permanent_life: {
    fyc: 0.90,      // 90% first-year commission
    renewal: 0.03,  // 3% renewal
    avgPremium: 3600 // $300/mo average
  },
  annuity: {
    fyc: 0.05,      // 5% of premium (one-time)
    renewal: 0,     // No renewal on most annuities
    avgPremium: 50000 // $50k average deposit
  },
  medicare: {
    fyc: 600,       // Flat $600 per policy (MAPD average)
    renewal: 300,   // $300 renewal
    avgPremium: 0   // N/A - flat commission
  },
};

export const PRODUCT_LABELS: Record<ProductType, string> = {
  term_life: 'Term Life Insurance',
  permanent_life: 'Permanent Life (Whole/IUL)',
  annuity: 'Fixed Annuities',
  medicare: 'Medicare Advantage',
};

export function calculateIncome(inputs: IncomeInputs): IncomeResults {
  const rates = COMMISSION_RATES[inputs.productType];

  // Calculate monthly activity
  const weeksPerMonth = 4.33;
  const monthlyAppointments = inputs.callsPerWeek * weeksPerMonth * (inputs.appointmentRate / 100);
  const monthlyPolicies = monthlyAppointments * (inputs.closeRate / 100);
  const policiesPerYear = monthlyPolicies * 12;

  // Calculate FYC based on product type
  let monthlyFYC: number;
  if (inputs.productType === 'medicare') {
    monthlyFYC = monthlyPolicies * rates.fyc;
  } else if (inputs.productType === 'annuity') {
    monthlyFYC = monthlyPolicies * inputs.avgPremium * rates.fyc;
  } else {
    monthlyFYC = monthlyPolicies * inputs.avgPremium * rates.fyc;
  }

  // Renewals kick in after year 1 (simplified model)
  const monthlyRenewals = 0; // Year 1 has no renewals

  const monthlyTotal = monthlyFYC + monthlyRenewals;
  const annualTotal = monthlyTotal * 12;

  // Project years 3 and 5 with renewals building
  let year3Renewals: number;
  let year5Renewals: number;

  if (inputs.productType === 'medicare') {
    // Medicare renewals: previous 2 years of policies paying $300/each
    year3Renewals = policiesPerYear * 2 * rates.renewal;
    year5Renewals = policiesPerYear * 4 * rates.renewal;
  } else if (inputs.productType === 'annuity') {
    year3Renewals = 0;
    year5Renewals = 0;
  } else {
    // Life insurance renewals compound
    year3Renewals = policiesPerYear * 2 * inputs.avgPremium * rates.renewal;
    year5Renewals = policiesPerYear * 4 * inputs.avgPremium * rates.renewal;
  }

  const year3Projection = annualTotal + year3Renewals;
  const year5Projection = annualTotal + year5Renewals;

  return {
    monthlyPolicies: Math.round(monthlyPolicies * 10) / 10,
    monthlyFYC: Math.round(monthlyFYC),
    monthlyRenewals: Math.round(monthlyRenewals),
    monthlyTotal: Math.round(monthlyTotal),
    annualTotal: Math.round(annualTotal),
    year3Projection: Math.round(year3Projection),
    year5Projection: Math.round(year5Projection),
    policiesPerYear: Math.round(policiesPerYear),
  };
}

// Default values for each product type
export const DEFAULT_INPUTS: Record<ProductType, Omit<IncomeInputs, 'productType'>> = {
  term_life: {
    callsPerWeek: 30,
    appointmentRate: 25,
    closeRate: 35,
    avgPremium: 1200,
  },
  permanent_life: {
    callsPerWeek: 25,
    appointmentRate: 20,
    closeRate: 30,
    avgPremium: 3600,
  },
  annuity: {
    callsPerWeek: 20,
    appointmentRate: 30,
    closeRate: 40,
    avgPremium: 50000,
  },
  medicare: {
    callsPerWeek: 40,
    appointmentRate: 35,
    closeRate: 50,
    avgPremium: 0,
  },
};
