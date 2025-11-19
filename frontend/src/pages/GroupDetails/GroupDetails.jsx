import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './GroupDetails.css';

const GroupDetails = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributionData, setContributionData] = useState({
    amount: '',
    memberId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    console.log('🔄 [FRONTEND] State updated - isLoading:', isLoading, 'error:', error, 'group:', !!group, 'members:', members.length);
  }, [isLoading, error, group, members]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const action = searchParams.get('action');
    
    if (action === 'invite') {
      setActiveTab('members');
      setTimeout(() => setShowInviteModal(true), 100);
    } else if (action === 'add-contribution') {
      setActiveTab('contributions');
      setTimeout(() => setShowContributionModal(true), 100);
    }
  }, [location.search]);

  useEffect(() => {
    console.log('🔄 [FRONTEND] Component mounted, fetching data for group:', groupId);
    fetchGroupDetails();
    fetchGroupMembers();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    console.log('🔄 [FRONTEND] Starting to fetch group details...');
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 [FRONTEND] Token exists for group details:', !!token);
      
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ [FRONTEND] Group response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ [FRONTEND] Group data received:', data);
      
      if (data.status === 'success') {
        setGroup(data.data.group);
        console.log('✅ [FRONTEND] Group state updated');
      } else {
        throw new Error(data.message || 'Failed to fetch group');
      }
      
    } catch (error) {
      console.error('💥 [FRONTEND] Error fetching group details:', error);
      setError(error.message);
    }
  };

  const fetchGroupMembers = async () => {
    console.log('🔄 [FRONTEND] Starting to fetch group members...');
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 [FRONTEND] Token exists for members:', !!token);
      
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ [FRONTEND] Members response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ [FRONTEND] Members data received:', data);
      
      if (data.status === 'success') {
        setMembers(data.data.members);
        console.log('✅ [FRONTEND] Members state updated, count:', data.data.members.length);
      } else {
        throw new Error(data.message || 'Failed to fetch members');
      }
      
    } catch (error) {
      console.error('💥 [FRONTEND] Error fetching group members:', error);
      setMembers([]);
      setError(prevError => prevError || error.message);
    } finally {
      setIsLoading(false);
      console.log('✅ [FRONTEND] Loading state set to false');
    }
  };

  const handleRecordContribution = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contributionData)
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Contribution recorded successfully!');
        setShowContributionModal(false);
        setContributionData({
          amount: '',
          memberId: '',
          date: new Date().toISOString().split('T')[0],
          description: ''
        });
      } else {
        alert(data.message || 'Failed to record contribution');
      }
    } catch (error) {
      console.error('Error recording contribution:', error);
      alert('Error recording contribution');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: inviteEmail })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert('Member invited successfully!');
        setShowInviteModal(false);
        setInviteEmail('');
        fetchGroupMembers(); // Refresh members list
      } else {
        alert(data.message || 'Failed to invite member');
      }
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Error inviting member');
    }
  };

  const retryLoading = () => {
    console.log('🔄 [FRONTEND] Retrying data load...');
    setError(null);
    setIsLoading(true);
    setGroup(null);
    setMembers([]);
    fetchGroupDetails();
    fetchGroupMembers();
  };

  if (isLoading) {
    return (
      <div className="group-details-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error && !group) {
    return (
      <div className="group-details-container">
        <div className="error-state">
          <h2>Error Loading Group</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={retryLoading}>
              Try Again
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-details-container">
        <div className="error-state">
          <h2>Group not found</h2>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group-details-container">
      {/* Header */}
      <header className="group-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <div className="group-header-content">
          <h1>{group.name}</h1>
          <p>{group.description}</p>
          <div className="group-stats">
            <span>KES {group.contribution_amount} • {group.meeting_frequency}</span>
            <span>{members.length} members</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={retryLoading} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members ({members.length})
        </button>
        <button 
          className={`tab ${activeTab === 'contributions' ? 'active' : ''}`}
          onClick={() => setActiveTab('contributions')}
        >
          Contributions
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="info-card">
              <h3>Group Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Group Type:</label>
                  <span>{group.group_type ? group.group_type.charAt(0).toUpperCase() + group.group_type.slice(1).replace('_', ' ') : 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Meeting Frequency:</label>
                  <span>{group.meeting_frequency ? group.meeting_frequency.charAt(0).toUpperCase() + group.meeting_frequency.slice(1) : 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Contribution Amount:</label>
                  <span>KES {group.contribution_amount || 0}</span>
                </div>
                <div className="info-item">
                  <label>Total Savings:</label>
                  <span>KES {group.total_savings || 0}</span>
                </div>
                <div className="info-item">
                  <label>Date Created:</label>
                  <span>{group.date_created ? new Date(group.date_created).toLocaleDateString() : 'Not available'}</span>
                </div>
                <div className="info-item">
                  <label>Total Members:</label>
                  <span>{members.length}</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="info-card">
              <h3>Quick Stats</h3>
              <div className="stats-grid-mini">
                <div className="stat-mini">
                  <div className="stat-value">{members.filter(m => m.status === 'active').length}</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-value">{members.filter(m => m.status === 'pending').length}</div>
                  <div className="stat-label">Pending Invites</div>
                </div>
                <div className="stat-mini">
                  <div className="stat-value">KES {group.total_savings || 0}</div>
                  <div className="stat-label">Total Savings</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="members-header">
              <h3>Group Members ({members.length})</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowInviteModal(true)}
              >
                + Invite Member
              </button>
            </div>

            <div className="members-list">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    {member.user?.name ? member.user.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div className="member-info">
                    <h4>
                      {member.user?.name || 'Unknown User'} 
                      {member.is_creator && ' (Creator)'}
                    </h4>
                    <p>{member.user?.email || 'No email'}</p>
                    <span className={`member-status ${member.status}`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="member-role">
                    <span className={`role-badge ${member.role}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
              
              {members.length === 0 && (
                <div className="no-members">
                  <p>No members yet. Invite someone to join your group!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="contributions-tab">
            <div className="contributions-header">
              <h3>Contributions</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowContributionModal(true)}
              >
                + Record Contribution
              </button>
            </div>

            <div className="contributions-stats">
              <div className="contribution-stat">
                <span className="stat-label">Total Collected</span>
                <span className="stat-amount">KES 0</span>
              </div>
              <div className="contribution-stat">
                <span className="stat-label">This Month</span>
                <span className="stat-amount">KES 0</span>
              </div>
              <div className="contribution-stat">
                <span className="stat-label">Members Paid</span>
                <span className="stat-amount">0/{members.filter(m => m.status === 'active').length}</span>
              </div>
            </div>

            <div className="contributions-list">
              <div className="no-contributions">
                <div className="empty-state">
                  <div className="empty-icon">💰</div>
                  <h4>No Contributions Yet</h4>
                  <p>Start recording contributions to track your group's savings</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowContributionModal(true)}
                  >
                    Record First Contribution
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Invite Member</h3>
            <form onSubmit={handleInviteMember}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter member's email"
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Contribution Modal */}
      {showContributionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Record Contribution</h3>
            <form onSubmit={handleRecordContribution}>
              <div className="form-group">
                <label>Amount (KES)</label>
                <input
                  type="number"
                  value={contributionData.amount}
                  onChange={(e) => setContributionData({...contributionData, amount: e.target.value})}
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Member</label>
                <select
                  value={contributionData.memberId}
                  onChange={(e) => setContributionData({...contributionData, memberId: e.target.value})}
                  required
                >
                  <option value="">Select a member</option>
                  {members.filter(m => m.status === 'active').map(member => (
                    <option key={member.id} value={member.id}>
                      {member.user?.name || 'Unknown User'} ({member.user?.email || 'No email'})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={contributionData.date}
                  onChange={(e) => setContributionData({...contributionData, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  value={contributionData.description}
                  onChange={(e) => setContributionData({...contributionData, description: e.target.value})}
                  placeholder="e.g., Monthly contribution"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowContributionModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>  
  );
};

export default GroupDetails;