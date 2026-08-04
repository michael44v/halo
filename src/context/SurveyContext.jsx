import React, { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

const initialFormData = {
  full_name: '',
  email: '',
  phone_number: '',
  business: '',
  selected_option: 'Option A',
  extra_field_1: '',
  extra_field_2: '',
  extra_field_3: '',
  password: '',
  confirmPassword: '',
  reenterEmail: '',
};

export function SurveyProvider({ children }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [submissionId, setSubmissionId] = useState(null);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const resetSurvey = () => {
    setStep(1);
    setFormData(initialFormData);
    setSubmissionId(null);
  };

  return (
    <SurveyContext.Provider
      value={{
        step,
        setStep,
        formData,
        updateFormData,
        nextStep,
        prevStep,
        submissionId,
        setSubmissionId,
        resetSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
}
