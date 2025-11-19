import api from './api';

export const loanService = {
  // Apply for loan
  applyForLoan: async (loanData) => {
    const response = await api.post('/loans', loanData);
    return response.data;
  },

  // Get loans for a group
  getGroupLoans: async (groupId) => {
    const response = await api.get(`/loans/group/${groupId}`);
    return response.data;
  },

  // Get user's loans
  getUserLoans: async (userId) => {
    const response = await api.get(`/loans/user/${userId}`);
    return response.data;
  },

  // Approve/reject loan
  updateLoanStatus: async (loanId, status) => {
    const response = await api.put(`/loans/${loanId}/status`, { status });
    return response.data;
  },

  // Record loan repayment
  recordRepayment: async (loanId, repaymentData) => {
    const response = await api.post(`/loans/${loanId}/repayments`, repaymentData);
    return response.data;
  }
};