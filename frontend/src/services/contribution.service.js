import api from './api';

export const contributionService = {
  // Record new contribution
  recordContribution: async (contributionData) => {
    const response = await api.post('/contributions', contributionData);
    return response.data;
  },

  // Get contributions for a group
  getGroupContributions: async (groupId) => {
    const response = await api.get(`/contributions/group/${groupId}`);
    return response.data;
  },

  // Get user's contributions
  getUserContributions: async (userId) => {
    const response = await api.get(`/contributions/user/${userId}`);
    return response.data;
  },

  // Update contribution
  updateContribution: async (contributionId, contributionData) => {
    const response = await api.put(`/contributions/${contributionId}`, contributionData);
    return response.data;
  }
};