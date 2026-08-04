import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';

export default function Step2Form() {
  const { formData, updateFormData, nextStep, prevStep, setSubmissionId } = useSurvey();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [localState, setLocalState] = useState({
    reenterEmail: formData.reenterEmail || '',
    password: formData.password || '',
    confirmPassword: formData.confirmPassword || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setApiError(null);

    if (!localState.reenterEmail.trim()) {
      newErrors.reenterEmail = 'Please re-enter your email';
    } else if (localState.reenterEmail.trim().toLowerCase() !== formData.email.trim().toLowerCase()) {
      newErrors.reenterEmail = 'Email does not match the email entered in Step 1';
    }

    if (!localState.password) {
      newErrors.password = 'Password is required';
    } else if (localState.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!localState.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (localState.password !== localState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Combine Step 1 + Step 2 data
    const combinedData = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      business: formData.business,
      selected_option: formData.selected_option,
      extra_field_1: formData.extra_field_1,
      extra_field_2: formData.extra_field_2,
      extra_field_3: formData.extra_field_3,
      password: localState.password,
    };

    try {
      const response = await fetch('/api/submit.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save Step 2 data to context
        updateFormData({
          reenterEmail: localState.reenterEmail,
          password: localState.password,
          confirmPassword: localState.confirmPassword,
        });
        // Save submission id reference
        setSubmissionId(result.id);
        nextStep();
      } else {
        setApiError(result.message || 'Verification submission failed. Please try again.');
      }
    } catch (err) {
      setApiError('Network error connecting to verification service. Please ensure PHP server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="survey-form">
      <h3>Step 2 — Security Verification</h3>

      {apiError && <div className="api-error-banner">{apiError}</div>}

      <div className="info-box">
        <p>Verifying details for: <strong>{formData.email}</strong></p>
      </div>

      <div className="form-group">
        <label htmlFor="reenterEmail">Re-enter Email Address *</label>
        <input
          type="email"
          id="reenterEmail"
          name="reenterEmail"
          value={localState.reenterEmail}
          onChange={handleChange}
          placeholder="john@example.com"
          className={errors.reenterEmail ? 'error' : ''}
          disabled={loading}
        />
        {errors.reenterEmail && <span className="error-text">{errors.reenterEmail}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={localState.password}
          onChange={handleChange}
          placeholder="••••••••"
          className={errors.password ? 'error' : ''}
          disabled={loading}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={localState.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          className={errors.confirmPassword ? 'error' : ''}
          disabled={loading}
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
      </div>

      <div className="form-actions" style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary"
          disabled={loading}
          style={{ flex: 1 }}
        >
          Back
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ flex: 2 }}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </form>
  );
}
