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
    <div className="landing-modern">
      {/* SECTION 1: MODERN DUAL-COLUMN HERO */}
      <section className="hero-modern-container">
        <div className="hero-modern-wrapper">
          <div className="hero-content">
            <div className="hero-badge-tag">
              <span className="badge-pulse"></span> Official Giveaway Platform
            </div>
            <h1 className="hero-modern-title">
              Complete Tasks & <span className="text-yellow-glow">Earn Daily Income</span>
            </h1>
            <p className="hero-modern-desc">
              Join thousands of active earners nationwide. Complete verified social media surveys and micro-tasks, submit proof, and enjoy instant bank payouts daily.
            </p>
            <div className="hero-cta-group">
              <Link to="/register" className="btn-modern-primary">
                Get Started Now ➔
              </Link>
              <Link to="/login" className="btn-modern-secondary">
                Member Login
              </Link>
            </div>
            <div className="hero-trust-row">
              <div className="trust-item">
                <span className="trust-icon">⚡</span> Instant Payouts
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span> Bank-Grade Verification
              </div>
              <div className="trust-item">
                <span className="trust-icon">🇳🇬</span> Local Banks Supported
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="visual-card-header">
              <img src="/logo.jpg" alt="Survey Giveaway Logo" className="visual-card-logo" />
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>Survey Giveaway App</h4>
                <span style={{ fontSize: '12px', color: '#a0aec0' }}>Live Earning Preview</span>
              </div>
            </div>
            <div className="visual-card-body">
              <div className="preview-stat-box">
                <span className="preview-label">Average Daily Earnings</span>
                <span className="preview-val">₦12,500 / day</span>
              </div>
              <div className="preview-task-item">
                <div className="task-preview-info">
                  <span className="task-type">Facebook & Survey Task</span>
                  <strong>Watch & Review AI Survey Video</strong>
                </div>
                <span className="task-reward-tag">+₦1,500</span>
              </div>
              <div className="preview-task-item">
                <div className="task-preview-info">
                  <span className="task-type">Social Share Task</span>
                  <strong>Share Giveaway Promo on Timeline</strong>
                </div>
                <span className="task-reward-tag">+₦2,500</span>
              </div>
            </div>
            <div className="visual-card-footer">
              <span className="status-dot"></span> 100% Guaranteed Payouts directly to Nigerian Banks
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: METRICS & STATS HIGHLIGHT */}
      <section className="stats-modern-section">
        <div className="stats-modern-container">
          <div className="stat-modern-box">
            <div className="stat-modern-number">15,000+</div>
            <div className="stat-modern-title">Active Contributors</div>
            <p className="stat-modern-sub">Completing daily surveys nationwide</p>
          </div>
          <div className="stat-modern-box border-left-highlight">
            <div className="stat-modern-number">₦45M+</div>
            <div className="stat-modern-title">Total Rewards Paid</div>
            <p className="stat-modern-sub">Directly transferred to bank accounts</p>
          </div>
          <div className="stat-modern-box border-left-highlight">
            <div className="stat-modern-number">24/7</div>
            <div className="stat-modern-title">Task Availability</div>
            <p className="stat-modern-sub">New tasks added continuously</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS (3 EASY STEPS) */}
      <section className="process-modern-section">
        <div className="section-header-center">
          <span className="section-kicker">SIMPLE & EASY</span>
          <h2 className="section-title">How To Start Earning In 3 Steps</h2>
        </div>
        <div className="process-grid">
          <div className="process-card">
            <div className="process-step-num">01</div>
            <div className="process-icon-wrap">📝</div>
            <h3 className="process-card-title">1. Create Account & Activate</h3>
            <p className="process-card-desc">
              Sign up in seconds. Make your quick initial tasking registration deposit via automated bank transfer to unlock your personalized earning dashboard.
            </p>
          </div>

          <div className="process-card">
            <div className="process-step-num">02</div>
            <div className="process-icon-wrap">🎯</div>
            <h3 className="process-card-title">2. Complete Daily Tasks</h3>
            <p className="process-card-desc">
              Access unlocked sequential tasks on your dashboard. Perform simple social interactions, videos, or survey tasks and paste your proof link.
            </p>
          </div>

          <div className="process-card">
            <div className="process-step-num">03</div>
            <div className="process-icon-wrap">💸</div>
            <h3 className="process-card-title">3. Admin Approval & Withdraw</h3>
            <p className="process-card-desc">
              As soon as admin verifies your proof link (turns green), your wallet balance updates immediately. Add your local Nigerian bank or MFB and cash out!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: PLATFORM ADVANTAGES & FEATURES */}
      <section className="features-modern-section">
        <div className="section-header-center">
          <span className="section-kicker">WHY CHOOSE US</span>
          <h2 className="section-title">Built For Instant, Secure Earnings</h2>
        </div>
        <div className="features-grid">
          <div className="feature-modern-card">
            <div className="feature-icon">🏦</div>
            <h4>All Nigerian Banks Supported</h4>
            <p>Withdraw seamlessly to First Bank, GTBank, Access, Zenith, Opay, PalmPay, Kuda, Moniepoint, and 100+ local MFBs.</p>
          </div>
          <div className="feature-modern-card">
            <div className="feature-icon">📱</div>
            <h4>No Experience Required</h4>
            <p>All you need is a smartphone and an active Facebook or social media account. Complete simple tasks anytime, anywhere.</p>
          </div>
          <div className="feature-modern-card">
            <div className="feature-icon">🛡️</div>
            <h4>Real-Time Proof Tracking</h4>
            <p>Track proof approval in real-time. Unverified submissions display in red, and turn green instantly once verified by admin.</p>
          </div>
          <div className="feature-modern-card">
            <div className="feature-icon">⚡</div>
            <h4>Automated Onboarding</h4>
            <p>Instant virtual account generation upon sign up with direct email dispatch containing your credentials and dashboard access.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE TESTIMONIAL TICKER & FINAL CTA */}
      <section className="ticker-cta-modern-section">
        <div className="ticker-title-modern">
          🔥 RECENT VERIFIED WITHDRAWALS TO NIGERIAN BANKS
        </div>
        <div className="ticker-wrap">
          <div className="ticker-move">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx} className="ticker-item-modern">
                <span className="user-avatar">{item.name[0]}</span>
                {item.name} cashed out <strong className="amount-tag">{item.amount}</strong>
              </span>
            ))}
          </div>
        </div>

        <div className="final-cta-banner">
          <h2 className="final-cta-title">Ready To Claim Your Daily Earnings?</h2>
          <p className="final-cta-subtitle">Join over 15,000 active contributors earning daily payouts directly to their bank accounts.</p>
          <Link to="/register" className="btn-modern-primary btn-large">
            Create Account & Start Earning ➔
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
