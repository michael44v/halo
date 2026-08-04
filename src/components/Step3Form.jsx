import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';

export default function Step3Form() {
  const { formData, submissionId, nextStep, prevStep } = useSurvey();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  // Initialize fields depending on selection
  const isOptionA = formData.selected_option === 'Option A';

  const [localState, setLocalState] = useState(
    isOptionA
      ? {
          target_audience: '',
          preferred_contact: 'Email',
          service_interest: '',
        }
      : {
          years_in_business: '',
          revenue_range: 'Under $50,000',
          primary_marketing_channel: '',
        }
  );

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

    // Validation
    if (isOptionA) {
      if (!localState.target_audience.trim()) {
        newErrors.target_audience = 'Target audience is required';
      }
      if (!localState.service_interest.trim()) {
        newErrors.service_interest = 'Service interest is required';
      }
    } else {
      if (!localState.years_in_business.trim()) {
        newErrors.years_in_business = 'Years in business is required';
      } else if (isNaN(localState.years_in_business) || parseInt(localState.years_in_business, 10) < 0) {
        newErrors.years_in_business = 'Please enter a valid number of years';
      }
      if (!localState.primary_marketing_channel.trim()) {
        newErrors.primary_marketing_channel = 'Primary marketing channel is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/submit_details.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: submissionId,
          dynamic_data: localState,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        nextStep(); // Advance to Step 4 (Awaiting Approval confirmation screen)
      } else {
        setApiError(result.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setApiError('Network error connecting to survey service. Please ensure PHP server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="survey-form">
      <h3>Step 3 — Custom Survey Info</h3>
      <p style={{ marginBottom: '16px', color: 'var(--accent)' }}>
        Track: <strong>{formData.selected_option}</strong>
      </p>

      {apiError && <div className="api-error-banner">{apiError}</div>}

      {isOptionA ? (
        /* Form A Fields */
        <>
          <div className="form-group">
            <label htmlFor="target_audience">Who is your target audience? *</label>
            <input
              type="text"
              id="target_audience"
              name="target_audience"
              value={localState.target_audience}
              onChange={handleChange}
              placeholder="e.g. Small Businesses, Tech Startups, Gen Z"
              className={errors.target_audience ? 'error' : ''}
              disabled={loading}
            />
            {errors.target_audience && <span className="error-text">{errors.target_audience}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="preferred_contact">Preferred contact method *</label>
            <select
              id="preferred_contact"
              name="preferred_contact"
              value={localState.preferred_contact}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Any">Any Method</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="service_interest">Which services are you interested in? *</label>
            <input
              type="text"
              id="service_interest"
              name="service_interest"
              value={localState.service_interest}
              onChange={handleChange}
              placeholder="e.g. Web Development, SEO, PPC"
              className={errors.service_interest ? 'error' : ''}
              disabled={loading}
            />
            {errors.service_interest && <span className="error-text">{errors.service_interest}</span>}
          </div>
        </>
      ) : (
        /* Form B Fields */
        <>
          <div className="form-group">
            <label htmlFor="years_in_business">How many years has your business been operating? *</label>
            <input
              type="number"
              id="years_in_business"
              name="years_in_business"
              value={localState.years_in_business}
              onChange={handleChange}
              placeholder="e.g. 5"
              className={errors.years_in_business ? 'error' : ''}
              disabled={loading}
            />
            {errors.years_in_business && <span className="error-text">{errors.years_in_business}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="revenue_range">Annual Revenue Range *</label>
            <select
              id="revenue_range"
              name="revenue_range"
              value={localState.revenue_range}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Under $50,000">Under $50,000</option>
              <option value="$50,000 - $200,000">$50,000 - $200,000</option>
              <option value="Over $200,000">Over $200,000</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="primary_marketing_channel">What is your primary marketing channel? *</label>
            <input
              type="text"
              id="primary_marketing_channel"
              name="primary_marketing_channel"
              value={localState.primary_marketing_channel}
              onChange={handleChange}
              placeholder="e.g. Social Media, Google Ads, Organic SEO"
              className={errors.primary_marketing_channel ? 'error' : ''}
              disabled={loading}
            />
            {errors.primary_marketing_channel && <span className="error-text">{errors.primary_marketing_channel}</span>}
          </div>
        </>
      )}

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
          {loading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </form>
  );
}
