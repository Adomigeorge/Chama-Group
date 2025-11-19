import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userGroups, setUserGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

    // Add stats state
  const [stats, setStats] = useState({
    totalSavings: 0,
    activeGroups: 0,
    totalMembers: 0,
    pendingActions: 0
  });

    // Add function to fetch stats
  const fetchDashboardStats = async (token) => {
    try {
      console.log('📊 Fetching dashboard stats...');
      
      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('📦 Stats response:', data);
      
      if (data.status === 'success') {
        setStats(data.data);
      }
    } catch (error) {
      console.error('💥 Error fetching stats:', error);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    console.log('🔐 Auth check:', { 
      hasToken: !!token, 
      hasUserData: !!userData 
    });

    if (!token || !userData) {
      console.log('❌ No authentication data - redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserGroups(token); 
      fetchDashboardStats(token); 
      console.log('User loaded:', parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleQuickAction = (actionType) => {
    if (userGroups.length === 0) {
      alert('Please create a group first');
      navigate('/create-group');
      return;
    }
    
    setSelectedAction(actionType);
    setShowGroupModal(true);
  };

  const handleGroupSelect = (groupId) => {
  setShowGroupModal(false);
  
  if (selectedAction === 'invite') {
    navigate(`/group/${groupId}?action=invite`);
  } else if (selectedAction === 'contribute') {
    navigate(`/group/${groupId}?action=add-contribution`);
      } else if (selectedAction === 'reports') {
    navigate(`/reports/${groupId}`);
  }
};

  // Fetch user's groups
  const fetchUserGroups = async (token) => {
    try {
      console.log('🔄 Fetching user groups...');
      console.log('Token:', token ? 'Exists' : 'Missing');
      
      const response = await fetch('http://localhost:5000/api/groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Full groups response:', data);
      
      if (data.status === 'success') {
        setUserGroups(data.data.groups || []);
        console.log(`✅ Loaded ${data.data.groups.length} groups`);
      } else {
        console.log('❌ Failed to fetch groups:', data.message);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const handleLogout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user.name || user.email}!</h1>
          <p>Manage your community savings groups</p>

          <button 
            className="back-to-home-btn"
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
        </div>
        <div className="user-menu">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
          </div>
          <div className="user-dropdown">
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
<section className="stats-section">
  <div className="stats-grid">
    <div className="stat-card primary">
      <div className="stat-icon">💰</div>
      <div className="stat-info">
        <h3>KES {stats.totalSavings.toLocaleString()}</h3>
        <p>Total Savings</p>
      </div>
    </div>
    <div className="stat-card secondary">
      <div className="stat-icon">👥</div>
      <div className="stat-info">
        <h3>{userGroups.length}</h3>
        <p>Active Groups</p>
      </div>
    </div>
    <div className="stat-card success">
      <div className="stat-icon">📈</div>
      <div className="stat-info">
        <h3>{stats.totalMembers}</h3>
        <p>Total Members</p>
      </div>
    </div>
    <div className="stat-card warning">
      <div className="stat-icon">🔄</div>
      <div className="stat-info">
        <h3>{stats.pendingActions}</h3>
        <p>Pending Actions</p>
      </div>
    </div>
  </div>
</section>

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Left Column - 2 equal cards */}
        <div className="content-column left-column">
          
          {/* Quick Actions Card */}
          <div className="card quick-actions equal-card">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-btn" onClick={handleCreateGroup}>
                <span className="action-icon">➕</span>
                Create Group
              </button>
              
              {/* Only this button is active - Invite Members */}
              <button 
                className="action-btn" 
                onClick={() => handleQuickAction('invite')}
              >
                <span className="action-icon">👥</span>
                Invite Members
              </button>
              
              {/* Add Contribution Button */}
              <button 
                className="action-btn" 
                onClick={() => handleQuickAction('contribute')}
              >
                <span className="action-icon">💸</span>
                 Add Contribution
              </button>
               {/* View Reports Button */}
              <button 
                className="action-btn" 
                onClick={() => handleQuickAction('reports')}
              >
                <span className="action-icon">📊</span>
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="card recent-activity equal-card">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">👋</div>
                <div className="activity-details">
                  <p><strong>Welcome to Chama Empowerment!</strong></p>
                  <span className="activity-time">Just now</span>
                </div>
              </div>
              {userGroups.length > 0 && (
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-details">
                    <p><strong>You</strong> created {userGroups.length} group(s)</p>
                    <span className="activity-time">Recently</span>
                  </div>
                </div>
              )}
              <div className="activity-item">
                <div className="activity-icon">💡</div>
                <div className="activity-details">
                  <p>Start managing your groups and contributions</p>
                  <span className="activity-time">Ready when you are</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 2 equal cards */}
        <div className="content-column right-column">
          
          {/* Your Groups Card */}
          <div className="card your-groups equal-card">
            <h2>Your Groups</h2>
            <div className="groups-list">
              {userGroups.length > 0 ? (
                userGroups.map(group => (
                  <div key={group.id} className="group-item">
                    <div className="group-avatar">🏠</div>
                    <div className="group-details">
                      <h4>{group.name}</h4>
                      <p>{group.description}</p>
                      <p>KES {group.contribution_amount} • {group.meeting_frequency}</p>
                    </div>
                    <button 
                      className="group-action"
                      onClick={() => navigate(`/group/${group.id}`)}
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <>
                  <div className="no-groups-message">
                    <div className="group-avatar">🏠</div>
                    <div className="group-details">
                      <h4>No groups yet</h4>
                      <p>Create your first savings group to start managing your community finances</p>
                    </div>
                  </div>
                  <div className="create-group-prompt">
                    <button className="btn btn-primary" onClick={handleCreateGroup}>
                      Create Your First Group
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Your Profile Card */}
          <div className="card user-profile-card equal-card">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <div className="profile-item">
                <span className="profile-label">Email:</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Member since:</span>
                <span className="profile-value">
                  {user.date_created ? new Date(user.date_created).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div className="profile-item">
                <span className="profile-label">Groups:</span>
                <span className="profile-value status-active">{userGroups.length} active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events - Full width thin card */}
      <div className="full-width-section">
        <div className="card upcoming-events thin-card">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            <div className="event-item">
              <div className="event-date">
                <span className="event-day">15</span>
                <span className="event-month">OCT</span>
              </div>
              <div className="event-details">
                <h4>Monthly Meeting</h4>
                <p>Family Savings Group</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">
                <span className="event-day">20</span>
                <span className="event-month">OCT</span>
              </div>
              <div className="event-details">
                <h4>Contribution Deadline</h4>
                <p>All groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Selection Modal for All Actions */}
{showGroupModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>
        {selectedAction === 'invite' 
          ? 'Select Group to Invite Members' 
          : selectedAction === 'contribute'
          ? 'Select Group to Add Contribution'
          : 'Select Group to View Reports'
        }
      </h3>
      <p>
        {selectedAction === 'invite'
          ? 'Choose which group you want to invite new members to:'
          : selectedAction === 'contribute'
          ? 'Choose which group you want to add a contribution to:'
          : 'Choose which group you want to view reports for:'
        }
      </p>
      
      <div className="group-selection-list">
        {userGroups.map(group => (
          <div key={group.id} className="group-selection-item">
            <div className="group-info">
              <h4>{group.name}</h4>
              <p>{group.description}</p>
              <small>KES {group.contribution_amount} • {group.meeting_frequency}</small>
            </div>
            <button 
              onClick={() => handleGroupSelect(group.id)}
              className="btn btn-primary"
            >
              {selectedAction === 'invite' 
                ? 'Invite to this Group' 
                : selectedAction === 'contribute'
                ? 'Add Contribution'
                : 'View Reports'
              }
            </button>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => setShowGroupModal(false)}
        className="btn btn-secondary"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {/* Debug Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        background: '#f5f5f5', 
        borderRadius: '5px', 
        fontSize: '12px',
        maxWidth: '500px',
        margin: '20px auto',
        color: '#2d3748'
      }}>
        <strong>Debug Info:</strong>
        <div>User: {user.email}</div>
        <div>User ID: {user.id}</div>
        <div>Groups: {userGroups.length}</div>
        <div>Has token: {!!localStorage.getItem('token') ? 'Yes' : 'No'}</div>
        <button 
          onClick={handleLogout} 
          style={{ 
            marginTop: '10px', 
            padding: '5px 10px', 
            background: '#ff4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Debug Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;