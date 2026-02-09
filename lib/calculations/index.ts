// Types
export type {
  BalanceSheetData,
  FNAResult,
  BusinessFNAResult,
  IncomeProtectionResult,
  BusinessProtectionSummary,
} from './types';

// Constants
export {
  EMERGENCY_FUND_MONTHS_TARGET,
  SAVINGS_RATE_TARGET,
  DEBT_TO_INCOME_WARNING,
  DEBT_TO_INCOME_CRITICAL,
  RETIREMENT_INCOME_REPLACEMENT,
  SAFE_WITHDRAWAL_RATE,
  INDUSTRY_MULTIPLIERS,
  getGrade,
  getStatus,
} from './constants';

// Personal Finance
export { calculatePersonalFNA } from './personal-finance';

// Business Finance
export {
  calculateBusinessFNA,
  calculateBusinessValuation,
  calculateBusinessProtectionSummary,
} from './business-finance';

// Protection Gap (Phase 2)
export { calculateIncomeProtection } from './protection-gap';
