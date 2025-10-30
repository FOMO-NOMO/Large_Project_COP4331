// Page: Survey
// Purpose: User survey/onboarding page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyForm from '../components/Survey/SurveyForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../store/AuthContext';
import type { SurveyData, SurveySubmissionRequest } from '../types';
import { buildPath } from '../Path';

export default function Survey() {
  const navigate = useNavigate();
  const { user, markSurveyComplete } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSurveySubmit = async (surveyData: SurveyData) => {
    if (!user?.id) {
      setError('Please log in to complete the survey');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const submissionData: SurveySubmissionRequest = {
        userId: user.id,
        ...surveyData
      };

      const response = await fetch(buildPath('api/survey/submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`Failed to submit survey: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
      markSurveyComplete(); // Mark survey as complete
      
      // Redirect to feed after a brief success message
      setTimeout(() => {
        navigate('/feed');
      }, 2000);

    } catch (err) {
      console.error('Survey submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="survey-page">
        <div className="survey-container">
          <div className="success-message">
            <h2>🎉 Survey Complete!</h2>
            <p>Thanks for completing your profile! Redirecting you to the feed...</p>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <div className="survey-container">
        <div className="survey-header">
          <h1>Welcome to FOMO NOMO!</h1>
          <p>Let's get to know you better so we can help you find the perfect groups and events.</p>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError('')} className="close-button">×</button>
          </div>
        )}

        <SurveyForm 
          onSubmit={handleSurveySubmit}
          isLoading={isLoading}
        />

        <div className="survey-footer">
          <p>This information helps us personalize your experience and connect you with relevant communities.</p>
        </div>
      </div>
    </div>
  );
}
