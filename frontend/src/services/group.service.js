import api from './api';

export const groupService = {
  // Create new group
  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Get all groups for current user
  getUserGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  // Get single group by ID
  getGroupById: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  // Update group
  updateGroup: async (groupId, groupData) => {
    const response = await api.put(`/groups/${groupId}`, groupData);
    return response.data;
  },

  // Add member to group
  addMember: async (groupId, memberData) => {
    const response = await api.post(`/groups/${groupId}/members`, memberData);
    return response.data;
  },

  // Get group members
  getGroupMembers: async (groupId) => {
    const response = await api.get(`/groups/${groupId}/members`);
    return response.data;
  }
};