export const APP_NAME = 'Chama Empowerment';
export const APP_DESCRIPTION = 'Community Savings & Loans Platform';

// Contribution frequencies
export const CONTRIBUTION_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_wallet', label: 'Mobile Wallet' },
];

// Loan statuses
export const LOAN_STATUSES = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
  completed: 'Completed',
};

export default {
  APP_NAME,
  APP_DESCRIPTION,
  CONTRIBUTION_FREQUENCIES,
  PAYMENT_METHODS,
  LOAN_STATUSES,
};