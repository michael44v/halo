import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const tickerItems = [
    { name: 'Oluwaseun A.', amount: '₦180,000' },
    { name: 'Chidimma K.', amount: '₦250,000' },
    { name: 'Ibrahim M.', amount: '₦120,000' },
    { name: 'Blessing E.', amount: '₦310,000' },
    { name: 'Emeka O.', amount: '₦200,000' },
    { name: 'Fatima Z.', amount: '₦150,000' },
  ];

  return (
    <div className="landing-container">
      {/* SECTION 1: HERO HEADER */}
      <section className="hero-section">
        <div style={{ marginBottom: '16px' }}>
          <img
            src="/logo.jpg"
            alt="Survey Giveaway Hero Logo"
            style={{ maxHeight: '120px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </div>
        <h1 className="hero-title">Help train the next biggest AI model</h1>
        <p className="hero-subtitle">
          Get paid to complete simple tasks from anywhere. Join thousands of contributors helping build the future.
        </p>
      </section>

      {/* SECTION 2: KEY STATS */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">10,000+</div>
          <div className="stat-label">Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₦20M+</div>
          <div className="stat-label">Paid out</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1-2</div>
          <div className="stat-label">Tasks daily</div>
        </div>
      </section>

      {/* SECTION 3: FEATURES & ONBOARDING */}
      <section>
        <div className="badges-section">
          <div className="feature-badge">Work Anywhere</div>
          <div className="feature-badge">Simple online tasks</div>
        </div>
        <p className="badge-info">
          No experience required. Only facebook required.<br />Quick onboarding
        </p>
      </section>

      {/* SECTION 4: MAIN CTA BUTTON */}
      <section className="cta-container">
        <Link to="/register" className="btn-cta">
          START EARNING TODAY &gt;
        </Link>
      </section>

      {/* SECTION 5: RUNNING TESTIMONIAL TICKER */}
      <section className="ticker-section">
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
      </section>
    </div>
  );
};

export default LandingPage;
