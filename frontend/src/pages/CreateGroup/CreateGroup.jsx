import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGroup.css';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    group_type: 'savings',
    meeting_frequency: 'monthly',
    contribution_amount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Creating group with data:', formData);
      
      const response = await fetch('http://localhost:5000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          contribution_amount: formData.contribution_amount ? parseInt(formData.contribution_amount) : 0
        })
      });

      const data = await response.json();
      console.log('📦 Create group response:', data);

      if (data.status === 'success') {
        console.log('✅ Group created successfully!');
        // Force full page reload to refresh dashboard data
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Failed to create group');
        console.log('❌ Group creation failed:', data.message);
      }
    } catch (error) {
      console.error('💥 Create group error:', error);
      setError('Network error - cannot connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-group-container">
      <div className="create-group-card">
        <div className="create-group-header">
          <h1>Create New Group</h1>
          <p>Start your Chama community</p>
        </div>

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="form-group">
            <label htmlFor="name">Group Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Family Savings, Work Chama"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is the purpose of this group?"
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="group_type">Group Type</label>
              <select
                id="group_type"
                name="group_type"
                value={formData.group_type}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="savings">Savings Group</option>
                <option value="investment">Investment Group</option>
                <option value="merry_go_round">Merry-Go-Round</option>
                <option value="project">Project Group</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="meeting_frequency">Meeting Frequency</label>
              <select
                id="meeting_frequency"
                name="meeting_frequency"
                value={formData.meeting_frequency}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contribution_amount">Contribution Amount (KES)</label>
            <input
              type="number"
              id="contribution_amount"
              name="contribution_amount"
              value={formData.contribution_amount}
              onChange={handleChange}
              placeholder="e.g., 1000"
              min="0"
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Creating Group...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;