import { useState, useEffect } from 'react';
import './HealthAssessmentPopup.css';

const HealthAssessmentPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    sex: '',
    isPregnant: false,
    age: '',
    respiratoryCondition: 'none',
    cardiovascularCondition: 'none',
    city: ''
  });

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        sex: '',
        isPregnant: false,
        age: '',
        respiratoryCondition: 'none',
        cardiovascularCondition: 'none',
        city: ''
      });
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the data for submission
      const assessmentData = {
        sex: formData.sex,
        isPregnant: formData.sex === 'female' ? formData.isPregnant : null,
        age: parseInt(formData.age),
        respiratoryCondition: formData.respiratoryCondition,
        cardiovascularCondition: formData.cardiovascularCondition,
        city: formData.city
      };

      console.log('Submitting Health Assessment Data:', assessmentData);
      
      // Send data to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/health-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Assessment result:', result);
      
      setSubmitSuccess(true);
      
      // Close popup after a short delay to show success message
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting health assessment:', error);
      setSubmitError(error.message || 'Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const respiratoryConditions = [
    'none',
    'asthma',
    'copd',
    'bronchitis',
    'pneumonia',
    'allergic rhinitis',
    'other'
  ];

  const cardiovascularConditions = [
    'none',
    'hypertension',
    'heart disease',
    'arrhythmia',
    'heart failure',
    'stroke history',
    'other'
  ];

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">
            <span className="title-icon">🫁</span>
            Health Assessment
          </h2>
          <button className="close-button" onClick={onClose}>
            <span className="close-icon">✕</span>
          </button>
        </div>

        <form className="assessment-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {submitError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {submitError}
            </div>
          )}
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              Assessment submitted successfully!
            </div>
          )}
          
          {/* Sex Selection */}
          <div className="form-group">
            <label className="form-label">Sex</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="sex"
                  value="male"
                  checked={formData.sex === 'male'}
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                />
                <span className="radio-custom"></span>
                <span className="radio-text">Male</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="sex"
                  value="female"
                  checked={formData.sex === 'female'}
                  onChange={(e) => handleInputChange('sex', e.target.value)}
                />
                <span className="radio-custom"></span>
                <span className="radio-text">Female</span>
              </label>
            </div>
          </div>

          {/* Pregnancy Question (only for females) */}
          {formData.sex === 'female' && (
            <div className="form-group">
              <label className="form-label">Are you pregnant?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="pregnant"
                    value="yes"
                    checked={formData.isPregnant === true}
                    onChange={() => handleInputChange('isPregnant', true)}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="pregnant"
                    value="no"
                    checked={formData.isPregnant === false}
                    onChange={() => handleInputChange('isPregnant', false)}
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-text">No</span>
                </label>
              </div>
            </div>
          )}

          {/* Age Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              className="form-input"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              required
            />
          </div>

          {/* Respiratory Conditions */}
          <div className="form-group">
            <label className="form-label" htmlFor="respiratory">Respiratory Conditions</label>
            <select
              id="respiratory"
              className="form-select"
              value={formData.respiratoryCondition}
              onChange={(e) => handleInputChange('respiratoryCondition', e.target.value)}
            >
              {respiratoryConditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Cardiovascular Conditions */}
          <div className="form-group">
            <label className="form-label" htmlFor="cardiovascular">Cardiovascular Conditions</label>
            <select
              id="cardiovascular"
              className="form-select"
              value={formData.cardiovascularCondition}
              onChange={(e) => handleInputChange('cardiovascularCondition', e.target.value)}
            >
              {cardiovascularConditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* City Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              className="form-input"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              <span className="button-text">
                {isSubmitting ? 'Submitting...' : 'Get Assessment'}
              </span>
              <div className="button-shine"></div>
            </button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="popup-decoration">
          <div className="decoration-orb orb-1"></div>
          <div className="decoration-orb orb-2"></div>
          <div className="decoration-orb orb-3"></div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessmentPopup;