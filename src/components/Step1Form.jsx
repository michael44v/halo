import React, { useState } from 'react';
import { useSurvey } from '../context/SurveyContext';

export default function Step1Form() {
  const { formData, updateFormData, nextStep } = useSurvey();
  const [errors, setErrors] = useState({});

  const [localState, setLocalState] = useState({
    full_name: formData.full_name,
    email: formData.email,
    phone_number: formData.phone_number,
    business: formData.business,
    selected_option: formData.selected_option || 'Option A',
    extra_field_1: formData.extra_field_1,
    extra_field_2: formData.extra_field_2,
    extra_field_3: formData.extra_field_3,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalState((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!localState.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!localState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(localState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!localState.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!localState.business.trim()) newErrors.business = 'Business name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateFormData(localState);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="survey-form">
      <h3>Step 1 — General Information</h3>

      <div className="form-group">
        <label htmlFor="full_name">Full Name *</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={localState.full_name}
          onChange={handleChange}
          placeholder="John Doe"
          className={errors.full_name ? 'error' : ''}
        />
        {errors.full_name && <span className="error-text">{errors.full_name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={localState.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone_number">Phone Number *</label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          value={localState.phone_number}
          onChange={handleChange}
          placeholder="+1 (555) 019-2834"
          className={errors.phone_number ? 'error' : ''}
        />
        {errors.phone_number && <span className="error-text">{errors.phone_number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="business">Business Name *</label>
        <input
          type="text"
          id="business"
          name="business"
          value={localState.business}
          onChange={handleChange}
          placeholder="Acme Corp"
          className={errors.business ? 'error' : ''}
        />
        {errors.business && <span className="error-text">{errors.business}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="selected_option">Select Survey Track *</label>
        <select
          id="selected_option"
          name="selected_option"
          value={localState.selected_option}
          onChange={handleChange}
        >
          <option value="Option A">Option A</option>
          <option value="Option B">Option B</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="extra_field_1">Website URL (Optional)</label>
        <input
          type="url"
          id="extra_field_1"
          name="extra_field_1"
          value={localState.extra_field_1}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="extra_field_2">Industry Sector (Optional)</label>
        <input
          type="text"
          id="extra_field_2"
          name="extra_field_2"
          value={localState.extra_field_2}
          onChange={handleChange}
          placeholder="Technology, Finance, Healthcare, etc."
        />
      </div>

      <div className="form-group">
        <label htmlFor="extra_field_3">Monthly Budget (Optional)</label>
        <input
          type="text"
          id="extra_field_3"
          name="extra_field_3"
          value={localState.extra_field_3}
          onChange={handleChange}
          placeholder="e.g. $5,000"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Continue to Step 2</button>
      </div>
    </form>
  );
}
