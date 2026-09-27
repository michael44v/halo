import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NIGERIAN_BANKS = [
  'Access Bank',
  'Access Bank (Diamond)',
  'ALAT by WEMA',
  'Amju Microfinance Bank',
  'Bainescredit MFB',
  'Bowen Microfinance Bank',
  'Carbon',
  'CEMCS Microfinance Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Ekondo Microfinance Bank',
  'FairMoney Microfinance Bank',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Hasal Microfinance Bank',
  'Heritage Bank',
  'Infinity MFB',
  'Jaiz Bank',
  'Keystone Bank',
  'Kuda Bank',
  'Moniepoint MFB',
  'Mutual Trust Microfinance Bank',
  'OPay',
  'Optimus Bank',
  'Palmpay',
  'Parallex Bank',
  'Parkway - ReadyCash',
  'Paycom',
  'Peace Microfinance Bank',
  'Petra Microfinance Bank',
  'Piggyvest / Pocket App',
  'Polaris Bank',
  'Providus Bank',
  'QuickFund MFB',
  'Rubies MFB',
  'SafeHaven MFB',
  'Sparkle Microfinance Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'TAJ Bank',
  'TCF MFB',
  'Titan Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'VFD Microfinance Bank',
  'Wema Bank',
  'Zenith Bank'
].filter(Boolean);

const WalletPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState(NIGERIAN_BANKS[0]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWallet();
  }, [user]);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/wallet.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.status === 'success' && data.wallet) {
        setAccountName(data.wallet.account_name || user.full_name);
        setAccountNumber(data.wallet.account_number || '');
        setBankName(data.wallet.bank_name || NIGERIAN_BANKS[0]);
      } else {
        setAccountName(user.full_name);
      }
    } catch (err) {
      setError('Failed to fetch wallet information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountName || !accountNumber || !bankName) return;

    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://127.0.0.1:8000/wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          account_name: accountName,
          account_number: accountNumber,
          bank_name: bankName
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setSuccessMsg('Bank account details saved successfully!');
      } else {
        setError(data.message || 'Failed to save wallet details');
      }
    } catch (err) {
      setError('Network error saving bank account details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="form-card" style={{ maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="logo-badge">Halo Logo</span>
          <h2 style={{ fontSize: '24px', margin: '12px 0 0', color: 'var(--text-primary)' }}>
            WALLET
          </h2>
        </div>

        {loading ? (
          <p>Loading wallet...</p>
        ) : (
          <div>
            {error && <div className="api-error-banner">{error}</div>}
            {successMsg && <div className="info-box" style={{ color: 'var(--success-color)' }}>{successMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Account holder full name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="10-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <select
                  className="form-control"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                >
                  {NIGERIAN_BANKS.map((bank, idx) => (
                    <option key={idx} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--danger-color)', fontStyle: 'italic', marginBottom: '20px' }}>
                *cross check details before submitting*
              </p>

              <button
                type="submit"
                className="btn-block"
                disabled={saving}
              >
                {saving ? 'Saving Details...' : 'Submit'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600' }}>
                &lt; Back to homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
