// API: Survey
// Purpose: Survey management API calls

import { buildPath } from '../Path.js';

interface SurveyResponse {
  questionId: string;
  answer: string | string[] | number;
}

interface SurveySubmission {
  responses: SurveyResponse[];
}

interface SurveyResults {
  id: string;
  userId: string;
  responses: SurveyResponse[];
  completedAt: string;
}

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
});

export class SurveyAPI {
  static async submitSurveyResponses(surveyData: SurveySubmission): Promise<SurveyResults> {
    try {
      const response = await fetch(buildPath('api/survey/submit'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(surveyData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit survey: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  }

  static async getSurveyResults(surveyId: string): Promise<SurveyResults> {
    try {
      const response = await fetch(buildPath(`api/survey/${surveyId}`), {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch survey results: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching survey results:', error);
      throw error;
    }
  }

  static async getUserSurveyResults(): Promise<SurveyResults | null> {
    try {
      const response = await fetch(buildPath('api/survey/me'), {
        headers: getAuthHeaders()
      });
      
      if (response.status === 404) {
        // User hasn't completed survey yet
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user survey results: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user survey results:', error);
      throw error;
    }
  }
}