import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/Picture1.png";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleStartTrial = () => {
    navigate('/register');
  };

 return (
    <div className="home-container">
      <img src={logo} alt="Chama Empowerment Logo" className="logo-fixed-top-left" />
      {/* Hero Section */}
      <section className="hero-section">
          <div className="hero-text-wrapper"> 
            <h1 className="hero-title">
              Empower Your Community
              <span className="highlight"> Smart Savings</span>
            </h1>
            <p className="hero-subtitle">
              Chama Empowerment brings traditional community savings into the digital age. 
              Manage your group finances securely, transparently, and efficiently.
            </p>
            <btns>
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started
              </button>
              </btns>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">💰</div>
              <h4>Group Savings</h4>
              <p>Collective growth</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">📈</div>
              <h4>Smart Tracking</h4>
              <p>Real-time updates</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🛡️</div>
              <h4>Secure</h4>
              <p>Bank-level security</p>
            </div>
          </div>
        
      </section>


      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Chama Empowerment?</h2>
            <p>Everything you need to manage your community finances effectively</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Group Management</h3>
              <p>Easily manage members, roles, and permissions for your savings group.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-piggy-bank"></i>
              </div>
              <h3>Smart Savings</h3>
              <p>Set goals, track contributions, and watch your collective savings grow.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3>Low-Interest Loans</h3>
              <p>Access affordable loans with flexible repayment terms for members.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Financial Reports</h3>
              <p>Detailed analytics and reports to track your group's financial health.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure & Transparent</h3>
              <p>Bank-level security with complete transparency for all transactions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Friendly</h3>
              <p>Access your account from anywhere with our mobile-optimized platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works in 3 Simple Steps</h2>
            <p>Get your community started in minutes</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Group</h3>
                <p>Register your community group and invite members with a simple link.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Start Saving Together</h3>
                <p>Set savings goals, schedule contributions, and track progress in real-time.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Grow & Access Loans</h3>
                <p>Watch your savings grow and provide loans to members when needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Community Savings?</h2>
            <p>Join thousands of communities already growing together with Chama Empowerment</p>
            <div className="cta-buttons">
              <button className="btn btn-large btn-primary" onClick={handleStartTrial}>
                Start
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
