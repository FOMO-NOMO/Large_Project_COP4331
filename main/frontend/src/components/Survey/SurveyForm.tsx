// Component: Survey Form
// Purpose: Reusable survey form component for user onboarding

import React, { useState } from 'react';
import type { SurveyData } from '../../types';

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void;
  isLoading?: boolean;
  initialData?: Partial<SurveyData>;
}

const AVAILABLE_INTERESTS = [
  'Sports', 'Music', 'Art', 'Technology', 'Gaming', 'Reading', 'Movies',
  'Travel', 'Cooking', 'Photography', 'Dance', 'Theater', 'Science',
  'Math', 'Writing', 'Volunteering', 'Fitness', 'Fashion', 'Business',
  'Environment', 'Politics', 'History', 'Languages', 'Anime', 'Crafts'
];

const MAJORS = [
  'Computer Science', 'Engineering', 'Business', 'Psychology', 'Biology',
  'Chemistry', 'Physics', 'Mathematics', 'English', 'History', 'Art',
  'Music', 'Theater', 'Political Science', 'Economics', 'Sociology',
  'Anthropology', 'Philosophy', 'Communications', 'Marketing', 'Finance',
  'Accounting', 'Nursing', 'Medicine', 'Education', 'Undecided', 'Other'
];

const CLASS_YEARS = [1, 2, 3, 4, 5]; // 1 = Freshman, 2 = Sophomore, etc.

export default function SurveyForm({ onSubmit, isLoading = false, initialData }: SurveyFormProps) {
  const [formData, setFormData] = useState<SurveyData>({
    interests: initialData?.interests || [],
    major: initialData?.major || '',
    classYear: initialData?.classYear || 1
  });

  const [errors, setErrors] = useState<Partial<SurveyData>>({});

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
    
    // Clear interest error when user selects at least one
    if (errors.interests && !formData.interests.includes(interest)) {
      setErrors(prev => ({ ...prev, interests: undefined }));
    }
  };

  const handleMajorChange = (major: string) => {
    setFormData(prev => ({ ...prev, major }));
    if (errors.major) {
      setErrors(prev => ({ ...prev, major: undefined }));
    }
  };

  const handleClassYearChange = (classYear: number) => {
    setFormData(prev => ({ ...prev, classYear }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<SurveyData> = {};

    if (formData.interests.length === 0) {
      newErrors.interests = ['Please select at least one interest'];
    }

    if (!formData.major) {
      newErrors.major = 'Please select your major';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const getClassYearLabel = (year: number): string => {
    const labels = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
    return labels[year - 1] || `Year ${year}`;
  };

  return (
    <form onSubmit={handleSubmit} className="survey-form">
      <div className="form-section">
        <h3>What are your interests?</h3>
        <p className="form-description">Select all that apply - this helps us match you with relevant groups and events.</p>
        
        <div className="interests-grid">
          {AVAILABLE_INTERESTS.map(interest => (
            <button
              key={interest}
              type="button"
              className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
        
        {errors.interests && (
          <div className="error-message">{Array.isArray(errors.interests) ? errors.interests[0] : errors.interests}</div>
        )}
      </div>

      <div className="form-section">
        <h3>What's your major?</h3>
        <select
          value={formData.major}
          onChange={(e) => handleMajorChange(e.target.value)}
          className={`form-select ${errors.major ? 'error' : ''}`}
        >
          <option value="">Select your major</option>
          {MAJORS.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
        
        {errors.major && (
          <div className="error-message">{errors.major}</div>
        )}
      </div>

      <div className="form-section">
        <h3>What year are you?</h3>
        <div className="class-year-options">
          {CLASS_YEARS.map(year => (
            <label key={year} className="radio-option">
              <input
                type="radio"
                name="classYear"
                value={year}
                checked={formData.classYear === year}
                onChange={() => handleClassYearChange(year)}
              />
              <span className="radio-label">{getClassYearLabel(year)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary survey-submit"
        >
          {isLoading ? 'Saving...' : 'Complete Survey'}
        </button>
      </div>
    </form>
  );
}