import React from 'react';
import { useSurvey } from '../context/SurveyContext';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import Step3Form from './Step3Form';

export default function SurveyContainer() {
  const { step, resetSurvey, formData } = useSurvey();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Form />;
      case 2:
        return <Step2Form />;
      case 3:
        return <Step3Form />;
      case 4:
        return (
          <div className="survey-success">
            <div className="success-icon">✓</div>
            <h2>Awaiting Approval</h2>
            <p className="success-desc">
              Thank you, <strong>{formData.full_name}</strong>! Your multi-step registration and custom survey responses have been submitted successfully.
            </p>
            <div className="summary-box">
              <p><strong>Business:</strong> {formData.business}</p>
              <p><strong>Selected Track:</strong> {formData.selected_option}</p>
              <p><strong>Status:</strong> <span className="status-badge awaiting">Awaiting Approval</span></p>
            </div>
            <button onClick={resetSurvey} className="btn btn-primary" style={{ marginTop: '20px' }}>
              Submit Another Response
            </button>
          </div>
        );
      default:
        return <Step1Form />;
    }
  };

  return (
    <div className="survey-container">
      <div className="progress-bar-container">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-num">{step > 1 ? '✓' : '1'}</div>
          <div className="step-label">General Info</div>
        </div>
        <div className={`progress-line ${step > 1 ? 'filled' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-num">{step > 2 ? '✓' : '2'}</div>
          <div className="step-label">Security</div>
        </div>
        <div className={`progress-line ${step > 2 ? 'filled' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="step-num">{step > 3 ? '✓' : '3'}</div>
          <div className="step-label">Survey</div>
        </div>
      </div>

      <div className="form-card">
        {renderStep()}
      </div>
    </div>
  );
}
