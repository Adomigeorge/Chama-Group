import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Reports.css';

const Reports = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [activeReport, setActiveReport] = useState('summary');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Fetch group data and report data
    fetchGroupData();
    fetchReportData();
  }, [groupId]);

  const fetchGroupData = async () => {
    // API call to get group details
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setGroup(data.data.group);
      }
    } catch (error) {
      console.error('Error fetching group:', error);
    }
  };

  const fetchReportData = async () => {
    // API call to get report data
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setReportData(data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const exportToPDF = () => {
    // PDF export functionality
    alert('PDF export feature coming soon!');
  };

  const exportToExcel = () => {
    // Excel export functionality
    alert('Excel export feature coming soon!');
  };

  if (!group) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Reports for {group.name}</h1>
        <div className="export-buttons">
          <button onClick={exportToPDF} className="btn btn-outline">
            📄 Export PDF
          </button>
          <button onClick={exportToExcel} className="btn btn-outline">
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="report-nav">
        <button 
          className={`nav-btn ${activeReport === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveReport('summary')}
        >
          📈 Financial Summary
        </button>
        <button 
          className={`nav-btn ${activeReport === 'contributions' ? 'active' : ''}`}
          onClick={() => setActiveReport('contributions')}
        >
          💰 Member Contributions
        </button>
        <button 
          className={`nav-btn ${activeReport === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveReport('loans')}
        >
          🏦 Loan Management
        </button>
        <button 
          className={`nav-btn ${activeReport === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveReport('performance')}
        >
          📊 Group Performance
        </button>
      </div>

      {/* Report Content */}
      <div className="report-content">
        {activeReport === 'summary' && (
          <FinancialSummary reportData={reportData} group={group} />
        )}
        {activeReport === 'contributions' && (
          <MemberContributions reportData={reportData} group={group} />
        )}
        {activeReport === 'loans' && (
          <LoanManagement reportData={reportData} group={group} />
        )}
        {activeReport === 'performance' && (
          <GroupPerformance reportData={reportData} group={group} />
        )}
      </div>
    </div>
  );
};

const FinancialSummary = ({ reportData, group }) => (
  <div className="report-section">
    <h2>Financial Summary</h2>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>KES {reportData?.totalSavings || '0'}</h3>
        <p>Total Group Savings</p>
      </div>
      <div className="stat-card">
        <h3>KES {reportData?.totalContributions || '0'}</h3>
        <p>Total Contributions</p>
      </div>
      <div className="stat-card">
        <h3>KES {reportData?.activeLoans || '0'}</h3>
        <p>Active Loans</p>
      </div>
      <div className="stat-card">
        <h3>KES {reportData?.totalExpenses || '0'}</h3>
        <p>Total Expenses</p>
      </div>
    </div>
  </div>
);

const MemberContributions = ({ reportData, group }) => (
  <div className="report-section">
    <h2>Member Contributions</h2>
    <div className="contributions-table">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Total Contributed</th>
            <th>Last Contribution</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through member contributions */}
          <tr>
            <td>John Doe</td>
            <td>KES 5,000</td>
            <td>2024-01-15</td>
            <td className="status-paid">Up to date</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const LoanManagement = ({ reportData, group }) => (
  <div className="report-section">
    <h2>Loan Management</h2>
    <div className="loans-stats">
      <div className="stat-card">
        <h3>{reportData?.activeLoansCount || '0'}</h3>
        <p>Active Loans</p>
      </div>
      <div className="stat-card">
        <h3>KES {reportData?.totalLoanAmount || '0'}</h3>
        <p>Total Loan Amount</p>
      </div>
      <div className="stat-card">
        <h3>{reportData?.defaultedLoans || '0'}</h3>
        <p>Defaulted Loans</p>
      </div>
    </div>
  </div>
);

const GroupPerformance = ({ reportData, group }) => (
  <div className="report-section">
    <h2>Group Performance</h2>
    <div className="performance-metrics">
      <div className="metric">
        <h4>Membership Growth</h4>
        <p>+{reportData?.membershipGrowth || '0'}% this year</p>
      </div>
      <div className="metric">
        <h4>Savings Growth</h4>
        <p>+{reportData?.savingsGrowth || '0'}% this year</p>
      </div>
      <div className="metric">
        <h4>Meeting Attendance</h4>
        <p>{reportData?.attendanceRate || '0'}% average</p>
      </div>
    </div>
  </div>
);

export default Reports;