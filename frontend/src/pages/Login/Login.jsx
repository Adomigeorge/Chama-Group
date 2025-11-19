import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ hideFooter = false, onToggleAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Network error - cannot connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Chama Empowerment account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
            >
                {isLoading ? 'Signing In…' : 'Sign In'}
            </button>

            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onToggleAuth && onToggleAuth(false)}
                disabled={isLoading}
            >
                Sign up
            </button>
        </div>
      </form>

      {!hideFooter && (
        <div className="login-footer">
            <p>Forgot your password? <Link to="/forgot-password" className="link">Reset</Link></p>
        </div>
      )}
    </>
  );
};

export default Login;