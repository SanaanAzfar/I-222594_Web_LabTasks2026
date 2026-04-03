import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import {FormField,TagInput,CheckboxGroup,SelectField} from './Form.jsx'
import ProgressBar from './ProgressBar.jsx';

export default function TravelerOnboarding() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', dob: '', passportPhoto: null,
    emergencyPhone: '', altPhone: '', address1: '', address2: '', city: '', state: '', postalCode: '', country: '',
    profession: '', otherProfession: '', travelExp: '', languages: [], linkedin: '', blogUrl: '',
    username: '', password: '', confirmPassword: '', notifications: { flights: false, visa: false, promo: false },
    terms: false, privacy: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  const COUNTRIES = { value: '', label: 'Select Country' };
  const COUNTRY_STATES = {
    'US': ['California', 'Texas', 'New York'],
    'UK': ['England', 'Scotland', 'Wales'],
    'CA': ['Ontario', 'British Columbia', 'Quebec'],
    'AU': ['New South Wales', 'Victoria', 'Queensland']
  };
  const COUNTRY_POSTAL_REGEX = {
    'US': /^\d{5}(-\d{4})?$/,
    'UK': /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
    'CA': /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/,
    'AU': /^\d{4}$/
  };
  const TEMP_EMAILS = ['tempmail.com', 'guerrillamail.com', 'yopmail.com', '10minutemail.com'];

  useEffect(() => {
    const saved = localStorage.getItem('travelerForm');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.data);
      setStep(parsed.step || 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('travelerForm', JSON.stringify({ data: formData, step }));
  }, [formData, step]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!showSuccess) e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showSuccess]);

  const calculateProgress = useCallback(() => {
    const requiredFields = [
      'firstName','lastName','email','dob','passportPhoto',
      'emergencyPhone','address1','city','state','postalCode','country',
      'profession','travelExp','languages',
      'username','password','confirmPassword','terms','privacy'
    ];
    let validCount = 0;
    requiredFields.forEach(field => {
      const val = formData[field];
      const isEmpty = Array.isArray(val) ? val.length === 0 : !val;
      const isValid = !errors[field];
      if (!isEmpty && isValid) validCount++;
    });
    return Math.min((validCount / requiredFields.length) * 100, 100);
  }, [formData, errors]);

  useEffect(() => { setProgress(calculateProgress()); }, [formData, errors, calculateProgress]);

  const validateField = (name, value, data) => {
    let err = '';
    switch (name) {
      case 'firstName': case 'lastName':
        if (!/^[A-Za-z\s]{2,50}$/.test(value)) err = '2-50 alpha chars only, no numbers/special chars';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = 'Invalid email format';
        else if (TEMP_EMAILS.some(d => value.endsWith(d))) err = 'Temporary email domains not allowed';
        break;
      case 'dob': {
        const d = new Date(value);
        const now = new Date();
        let age = now.getFullYear() - d.getFullYear();
        const m = now.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
        if (d > now) err = 'Date cannot be in the future';
        else if (age < 18) err = 'Must be at least 18 years old';
        break;
      }
      case 'passportPhoto':
        if (value && (!value.type.startsWith('image/') || value.size > 5 * 1024 * 1024))
          err = 'Only JPG/PNG under 5MB allowed';
        break;
      case 'emergencyPhone':
        if (!/^\+?[1-9]\d{7,14}$/.test(value)) err = 'Invalid international phone format (e.g., +1234567890)';
        break;
      case 'address1': if (value.length < 5) err = 'Minimum 5 characters'; break;
      case 'city': if (/\d/.test(value)) err = 'City cannot contain numbers'; break;
      case 'state': if (!value) err = 'State required for selected country'; break;
      case 'postalCode': {
        const regex = COUNTRY_POSTAL_REGEX[data.country] || /^\w{3,6}$/;
        if (!regex.test(value)) err = 'Invalid postal code for selected country';
        break;
      }
      case 'profession': if (!value) err = 'Required'; break;
      case 'otherProfession': if (data.profession === 'Other' && !value.trim()) err = 'Required if Other selected'; break;
      case 'travelExp': {
        const age = data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() - 18 : 0;
        const num = parseInt(value);
        if (isNaN(num) || num < 0) err = 'Must be non-negative';
        else if (num > age) err = `Cannot exceed age - 18 (max: ${age})`;
        break;
      }
      case 'languages': if (value.length < 2 || value.length > 10) err = 'Between 2 and 10 languages required'; break;
      case 'linkedin': if (value && !/^https:\/\/(www\.)?linkedin\.com\/.+$/.test(value)) err = 'Must be a valid LinkedIn URL'; break;
      case 'blogUrl': if (value && !/^https?:\/\/.+\..+$/.test(value)) err = 'Must be a valid URL'; break;
      case 'username':
        if (!/^[A-Za-z0-9_]{5,20}$/.test(value)) err = '5-20 chars, alphanumeric & underscore only';
        else if (['admin', 'user', 'traveler', 'root'].includes(value.toLowerCase())) err = 'Username already taken (mock)';
        break;
      case 'password':
        if (value.length < 8) err = 'Minimum 8 characters';
        else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value) || !/[!@#$%^&*]/.test(value))
          err = 'Requires uppercase, lowercase, number & special char';
        break;
      case 'confirmPassword': if (value !== data.password) err = 'Passwords do not match'; break;
      case 'terms': case 'privacy': if (!value) err = 'Must be accepted to continue'; break;
      default: break;
    }
    return err;
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === 'checkbox' ? checked : (type === 'file' ? e.target.files[0] : value);
    setTouched(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, finalVal, formData);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalVal = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: finalVal }));
    if (touched[name]) {
      const err = validateField(name, finalVal, { ...formData, [name]: finalVal });
      setErrors(prev => ({ ...prev, [name]: err }));
    }
  };

  const handleCheckboxChange = (group, key) => {
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group], [key]: !prev[group][key] }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, passportPhoto: file }));
    if (touched.passportPhoto) {
      setErrors(prev => ({ ...prev, passportPhoto: validateField('passportPhoto', file, formData) }));
    }
  };

  const handleAddTag = (tag) => {
    if (tag && !formData.languages.includes(tag) && formData.languages.length < 10) {
      const newLangs = [...formData.languages, tag];
      setFormData(prev => ({ ...prev, languages: newLangs }));
      const err = validateField('languages', newLangs, formData);
      setErrors(prev => ({ ...prev, languages: err }));
    }
  };

  const handleRemoveTag = (tag) => {
    const newLangs = formData.languages.filter(l => l !== tag);
    setFormData(prev => ({ ...prev, languages: newLangs }));
    const err = validateField('languages', newLangs, formData);
    setErrors(prev => ({ ...prev, languages: err }));
  };

  const handleNotificationChange = (group, key) => {
    setFormData(prev => ({ ...prev, [group]: { ...prev[group], [key]: !prev[group][key] } }));
  };

  const nextStep = () => {
    const stepFields = {
      1: ['firstName','lastName','email','dob','passportPhoto'],
      2: ['emergencyPhone','address1','city','state','postalCode','country'],
      3: ['profession','travelExp','languages'],
      4: ['username','password','confirmPassword','terms','privacy']
    };
    const currentErrors = {};
    stepFields[step].forEach(field => {
      const val = formData[field];
      const err = validateField(field, val, formData);
      if (err) currentErrors[field] = err;
    });

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setTouched(prev => stepFields[step].reduce((a, f) => ({ ...a, [f]: true }), prev));
      setNotification({ type: 'error', msg: 'Please fix highlighted fields before proceeding.' });
      return;
    }
    setStep(s => Math.min(s + 1, 4));
    setNotification(null);
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 1500));
    setIsLoading(false);
    setShowSuccess(true);
    localStorage.removeItem('travelerForm');
    setNotification({ type: 'success', msg: 'Onboarding complete! Welcome aboard.' });
  };

  const clearForm = () => {
    if (window.confirm('Clear all data? This cannot be undone.')) {
      localStorage.removeItem('travelerForm');
      setFormData({ firstName: '', lastName: '', email: '', dob: '', passportPhoto: null, emergencyPhone: '', altPhone: '', address1: '', address2: '', city: '', state: '', postalCode: '', country: '', profession: '', otherProfession: '', travelExp: '', languages: [], linkedin: '', blogUrl: '', username: '', password: '', confirmPassword: '', notifications: { flights: false, visa: false, promo: false }, terms: false, privacy: false });
      setErrors({});
      setTouched({});
      setStep(1);
      setShowSuccess(false);
      setNotification({ type: 'info', msg: 'Form cleared successfully.' });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div className="step-container">
          <h2>Step 1: Traveler Identity</h2>
          <FormField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} error={errors.firstName} />
          <FormField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} error={errors.lastName} />
          <FormField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} />
          <FormField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} onBlur={handleBlur} error={errors.dob} />
          <div className="form-group">
            <label>Passport Photo <span className="req">*</span></label>
            <input type="file" name="passportPhoto" onChange={handleFileChange} onBlur={handleBlur} accept="image/*" className={errors.passportPhoto ? 'input-error' : ''} />
            {errors.passportPhoto && <span className="error-msg">{errors.passportPhoto}</span>}
          </div>
        </div>
      );
      case 2: return (
        <div className="step-container">
          <h2>Step 2: Contact & Origin</h2>
          <FormField label="Emergency Phone" name="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={handleChange} onBlur={handleBlur} placeholder="+1234567890" error={errors.emergencyPhone} />
          <FormField label="Alt Phone (Optional)" name="altPhone" type="tel" value={formData.altPhone} onChange={handleChange} onBlur={handleBlur} placeholder="+1987654321" />
          <FormField label="Address Line 1" name="address1" value={formData.address1} onChange={handleChange} onBlur={handleBlur} error={errors.address1} />
          <FormField label="Address Line 2" name="address2" value={formData.address2} onChange={handleChange} onBlur={handleBlur} placeholder="Optional" />
          <FormField label="City" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} error={errors.city} />
          <SelectField label="Country" name="country" value={formData.country} onChange={handleChange} options={Object.keys(COUNTRY_STATES).map(c => ({ value: c, label: c }))} error={errors.country} />
          {formData.country && <SelectField label="State/Province" name="state" value={formData.state} onChange={handleChange} options={COUNTRY_STATES[formData.country].map(s => ({ value: s, label: s }))} error={errors.state} />}
          <FormField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} onBlur={handleBlur} error={errors.postalCode} />
        </div>
      );
      case 3: return (
        <div className="step-container">
          <h2>Step 3: Background & Experience</h2>
          <SelectField label="Profession" name="profession" value={formData.profession} onChange={handleChange} options={[{ value: 'Tech', label: 'Technology' }, { value: 'Health', label: 'Healthcare' }, { value: 'Edu', label: 'Education' }, { value: 'Other', label: 'Other' }]} error={errors.profession} />
          {formData.profession === 'Other' && <FormField label="Specify Profession" name="otherProfession" value={formData.otherProfession} onChange={handleChange} onBlur={handleBlur} error={errors.otherProfession} />}
          <FormField label="Int. Travel Experience (Years)" name="travelExp" type="number" value={formData.travelExp} onChange={handleChange} onBlur={handleBlur} error={errors.travelExp} />
          <TagInput label="Languages Known (Write one first then press enter then the other)" tags={formData.languages} onAdd={handleAddTag} onRemove={handleRemoveTag} error={errors.languages} min={2} max={10} />
          <FormField label="LinkedIn Profile" name="linkedin" value={formData.linkedin} onChange={handleChange} onBlur={handleBlur} error={errors.linkedin} placeholder="https://linkedin.com/in/..." />
          <FormField label="Travel Blog/Website" name="blogUrl" value={formData.blogUrl} onChange={handleChange} onBlur={handleBlur} error={errors.blogUrl} placeholder="https://..." />
        </div>
      );
      case 4: return (
        <div className="step-container">
          <h2>Step 4: Account & Preferences</h2>
          <FormField label="Portal Username" name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} error={errors.username} />
          <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} />
          <FormField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={errors.confirmPassword} />
          <CheckboxGroup label="Notification Preferences" name="notifications" options={[{ value: 'flights', label: 'Flight Updates' }, { value: 'visa', label: 'Visa Updates' }, { value: 'promo', label: 'Promotional Offers' }]} value={formData.notifications} onChange={handleNotificationChange} />
          <div className="form-group">
            <label className="checkbox-item"><input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} onBlur={handleBlur} /> I accept the <strong>Travel Terms & Conditions</strong> <span className="req">*</span></label>
            {errors.terms && <span className="error-msg">{errors.terms}</span>}
          </div>
          <div className="form-group">
            <label className="checkbox-item"><input type="checkbox" name="privacy" checked={formData.privacy} onChange={handleChange} onBlur={handleBlur} /> I consent to <strong>Data Privacy Policy</strong> <span className="req">*</span></label>
            {errors.privacy && <span className="error-msg">{errors.privacy}</span>}
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="app-wrapper">
      {notification && (
        <div className={`notification ${notification.type}`} onClick={() => setNotification(null)}>
          {notification.msg}
        </div>
      )}

      {showSuccess ? (
        <div className="success-screen">
          <h2> Welcome Aboard, {formData.firstName}!</h2>
          <p>Your traveler profile has been successfully created.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Return to Dashboard</button>
        </div>
      ) : (
        <>
          <header className="app-header">
            <h1> Traveler Onboarding System</h1>
            <ProgressBar percent={progress} />
          </header>

          <form className="form-container" onSubmit={e => e.preventDefault()}>
            {renderStep()}

            <div className="nav-buttons">
              {step > 1 && <button type="button" className="btn-secondary" onClick={prevStep}>← Previous</button>}
              {step < 4 ? (
                <button type="button" className="btn-primary" onClick={nextStep}>Next →</button>
              ) : (
                <button type="button" className="btn-success" disabled={isLoading} onClick={handleSubmit}>
                  {isLoading ? 'Processing...' : 'Complete Onboarding'}
                </button>
              )}
            </div>
            <button type="button" className="btn-danger clear-btn" onClick={clearForm}> Clear Form</button>
          </form>
        </>
      )}
    </div>
  );
}