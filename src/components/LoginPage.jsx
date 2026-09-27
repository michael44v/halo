import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.status === 'success') {
        login(data.user);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error connecting to login API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="form-card">
        <h2 className="form-title">Sign In Page</h2>

        {error && <div className="api-error-banner">{error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>Username / Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-block"
            style={{ marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOG IN >'}
          </button>
        </form>

        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          color: 'var(--primary-color)',
          fontWeight: '600',
          fontSize: '15px'
        }}>
          &gt; You can also make money by referring friends. &lt;
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
