import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { savePendingReg, login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    category_amount: '5000',
    payment_method: 'korapay'
  });

  const [step, setStep] = useState('register'); // 'register' | 'payment' | 'email_modal'
  const [paymentData, setPaymentData] = useState(null);
  const [successEmailData, setSuccessEmailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.full_name.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '';

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_amount: parseFloat(formData.category_amount)
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setPaymentData(data);
        savePendingReg(data);
        setStep('payment');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentData || !paymentData.user_id) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/verify_payment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: paymentData.user_id })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setSuccessEmailData(data.email_details);
        setStep('email_modal');
      } else {
        setError(data.message || 'Payment verification failed');
      }
    } catch (err) {
      setError('Network error verifying payment');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = async () => {
    if (paymentData && paymentData.email && paymentData.temp_password) {
      try {
        const res = await fetch('http://127.0.0.1:8000/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: paymentData.username || paymentData.email,
            password: paymentData.temp_password
          })
        });

        const loginRes = await res.json();
        if (loginRes.status === 'success') {
          savePendingReg(null);
          login(loginRes.user);
          navigate('/dashboard');
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    navigate('/login');
  };

  return (
    <div className="landing-container">
      {step === 'register' && (
        <div className="form-card">
          <h2 className="form-title">REGISTRATION</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
            After clicking Start earning today
          </p>

          {error && <div className="api-error-banner">{error}</div>}

          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                placeholder="Full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone No.</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>+234</span>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone No."
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>TASKING CATEGORY</label>
              <select
                name="category_amount"
                className="form-control"
                value={formData.category_amount}
                onChange={handleChange}
              >
                <option value="5000">₦5,000 Category (Earn ₦1,250/task)</option>
                <option value="10000">₦10,000 Category (Earn ₦2,500/task)</option>
                <option value="15000">₦15,000 Category (Earn ₦3,750/task)</option>
                <option value="20000">₦20,000 Category (Earn ₦5,000/task)</option>
              </select>
              <small style={{ color: 'var(--primary-color)', marginTop: '6px', fontWeight: '500' }}>
                NOTE: ALL TASKING CATEGORIES HAVE DIFFERENT PAYMENTS FOR TASKS DONE. A TASK EARNS 25% OF YOUR CATEGORY PAYMENT.
              </small>
            </div>

            <div className="form-group">
              <label>SELECT PAYMENT METHOD</label>
              <select
                name="payment_method"
                className="form-control"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="korapay">Korapay Transfer / Card</option>
                <option value="bank_transfer">Direct Bank Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-block"
              disabled={!isFormValid || loading}
            >
              {loading ? 'Processing...' : 'MAKE PAYMENT'}
            </button>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '8px' }}>
              *clicking on this should only be possible after all the above information has been given
            </p>
          </form>
        </div>
      )}

      {step === 'payment' && paymentData && (
        <div className="form-card">
          <h2 className="form-title">Korapay Payment</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Transfer exactly <strong>₦{Number(paymentData.category_amount).toLocaleString()}</strong> to the generated account below:
          </p>

          {error && <div className="api-error-banner">{error}</div>}

          <div className="payment-details-box">
            <div className="payment-row">
              <span className="payment-label">Bank Name:</span>
              <span className="payment-val">{paymentData.bank_name}</span>
            </div>
            <div className="payment-row">
              <span className="payment-label">Account Number:</span>
              <span className="payment-val" style={{ fontSize: '20px', color: 'var(--primary-color)' }}>
                {paymentData.virtual_account_number}
              </span>
            </div>
            <div className="payment-row">
              <span className="payment-label">Account Name:</span>
              <span className="payment-val">{paymentData.account_name}</span>
            </div>
            <div className="payment-row" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <span className="payment-label">Amount Due:</span>
              <span className="payment-val" style={{ color: 'var(--success-color)', fontSize: '18px' }}>
                ₦{Number(paymentData.category_amount).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmPayment}
            className="btn-block"
            disabled={loading}
          >
            {loading ? 'Verifying Transfer...' : 'I HAVE MADE PAYMENT'}
          </button>
        </div>
      )}

      {/* EMAIL / SMS NOTIFICATION MODAL */}
      {step === 'email_modal' && successEmailData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              backgroundColor: 'var(--success-bg)', color: 'var(--success-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', margin: '0 auto 16px'
            }}>
              ✓
            </div>
            <h3 style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: '22px' }}>
              "Registration Successful"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '20px' }}>
              Find your login details below:
            </p>

            <div style={{
              backgroundColor: '#f8fafc', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '16px', textAlign: 'left', marginBottom: '24px'
            }}>
              <p style={{ margin: '4px 0', fontSize: '15px' }}>
                <strong>Username:</strong> {successEmailData.username}
              </p>
              <p style={{ margin: '4px 0', fontSize: '15px' }}>
                <strong>Password:</strong> {paymentData?.temp_password}
              </p>
            </div>

            <p style={{ fontWeight: '700', color: 'var(--primary-color)', fontSize: '18px', marginBottom: '24px' }}>
              Welcome to the Halo Family
            </p>

            <button onClick={handleModalClose} className="btn-block">
              PROCEED TO LOGIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
