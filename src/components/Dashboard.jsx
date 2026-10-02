import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.status === 'success') {
        setTasks(data.tasks);
        setUserData(data.user);
      } else {
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Network error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const tickerItems = [
    { name: 'Oluwaseun A.', amount: '₦180,000' },
    { name: 'Chidimma K.', amount: '₦250,000' },
    { name: 'Ibrahim M.', amount: '₦120,000' },
    { name: 'Blessing E.', amount: '₦310,000' },
  ];

  return (
    <div className="landing-container" style={{ padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* HEADER WELCOME BANNER */}
        <div className="form-card" style={{ maxWidth: '100%', marginBottom: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="logo-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>Halo Logo</span>
              <h2 style={{ margin: '8px 0 0', fontSize: '24px', color: 'var(--text-primary)' }}>
                Welcome, {userData?.full_name || user?.full_name}
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Link to="/wallet" className="nav-link nav-btn" style={{ textDecoration: 'none' }}>
                Wallet
              </Link>
            </div>
          </div>
        </div>

        {/* TASKS FOR THE DAY */}
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>
          TASKS FOR THE DAY
        </h3>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {[1, 2].map((n) => (
              <div key={n} className="form-card" style={{ maxWidth: '100%', margin: 0 }}>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                <div className="skeleton skeleton-btn" style={{ marginTop: '16px' }}></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="api-error-banner">{error}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {tasks.map((task) => {
              const isApproved = task.status === 'approved';
              const isPending = task.status === 'pending_approval';
              const isUnlocked = task.is_unlocked;

              return (
                <div
                  key={task.id}
                  className="form-card"
                  style={{
                    maxWidth: '100%',
                    margin: 0,
                    opacity: isUnlocked ? 1 : 0.6,
                    border: isApproved ? '2px solid var(--success-color)' : isPending ? '2px solid var(--danger-color)' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary-color)' }}>
                      TASK {task.step_number}
                    </span>
                    {!isUnlocked ? (
                      <span style={{ fontSize: '12px', background: '#e2e8f0', color: '#64748b', padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
                        Locked
                      </span>
                    ) : isApproved ? (
                      <span style={{ fontSize: '12px', background: 'var(--success-bg)', color: 'var(--success-color)', padding: '4px 8px', borderRadius: '12px', fontWeight: '700' }}>
                        Approved
                      </span>
                    ) : isPending ? (
                      <span style={{ fontSize: '12px', background: 'var(--danger-bg)', color: 'var(--danger-color)', padding: '4px 8px', borderRadius: '12px', fontWeight: '700' }}>
                        Pending Approval
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '12px', fontWeight: '700' }}>
                        Ready
                      </span>
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 8px', fontSize: '16px' }}>"{task.title}"</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {task.description}
                  </p>

                  {task.proof_link && (
                    <div className={`proof-box ${isApproved ? 'approved' : 'pending'}`}>
                      {isPending ? 'Submitted link: ' : 'Approved link: '}
                      <a href={task.proof_link} target="_blank" rel="noreferrer" style={{ color: 'inherit', wordBreak: 'break-all' }}>
                        {task.proof_link}
                      </a>
                    </div>
                  )}

                  {isUnlocked ? (
                    <Link to={`/task/${task.id}`} className="btn-block" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '12px' }}>
                      {task.proof_link ? 'View / Resubmit Proof' : 'Submit Proof Link'}
                    </Link>
                  ) : (
                    <button className="btn-block" disabled style={{ marginTop: '12px' }}>
                      Complete Previous Task First
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* AMOUNT MADE STAT BOX */}
        <div className="form-card" style={{ maxWidth: '100%', marginBottom: '24px', padding: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Amount Made
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--success-color)' }}>
            ₦{Number(userData?.balance || 0).toLocaleString()}
          </div>
        </div>

        {/* WITHDRAWAL TICKER / INFO */}
        <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '32px' }}>
          Your next withdrawal is in 40 days
        </div>

        {/* TICKER */}
        <div className="ticker-section" style={{ borderRadius: '12px' }}>
          <div className="ticker-title">OUR LAST MONTHS HIGHEST WITHDRAWALS</div>
          <div className="ticker-wrap">
            <div className="ticker-move">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <span key={idx} className="ticker-item">
                  {item.name} withdrew <strong>{item.amount}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
