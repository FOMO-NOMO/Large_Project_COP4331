// API: Survey
// Purpose: Survey management API calls

import { buildPath } from '../Path.js';
import type { SurveySubmissionRequest, SurveyResponse } from '../types';

export class SurveyAPI {
  static async submitSurvey(surveyData: SurveySubmissionRequest): Promise<SurveyResponse> {
    try {
      const response = await fetch(buildPath('api/survey/submit'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit survey: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  }
}