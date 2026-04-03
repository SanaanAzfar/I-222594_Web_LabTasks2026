import { useState } from 'react'
import React from 'react';
import './App.css'
export const FormField = ({ label, name, type, value, onChange, onBlur, error, placeholder, disabled }) => (
  <div className="form-group">
    <label htmlFor={name}>{label} {type !== 'file' && type !== 'checkbox' && <span className="req">*</span>}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={error ? 'input-error' : ''}
    />
    {error && <span className="error-msg">{error}</span>}
  </div>
);

export const SelectField = ({ label, name, value, onChange, options, error, disabled }) => (
  <div className="form-group">
    <label htmlFor={name}>{label} <span className="req">*</span></label>
    <select id={name} name={name} value={value} onChange={onChange} disabled={disabled} className={error ? 'input-error' : ''}>
      <option value="">Select...</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <span className="error-msg">{error}</span>}
  </div>
);

export const CheckboxGroup = ({ label, name, options, value, onChange, error }) => (
  <div className="form-group">
    <label>{label}</label>
    <div className="checkbox-grid">
      {options.map(opt => (
        <label key={opt.value} className="checkbox-item">
          <input type="checkbox" name={`${name}-${opt.value}`} checked={value[opt.value]} onChange={() => onChange(name, opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
    {error && <span className="error-msg">{error}</span>}
  </div>
);

export const TagInput = ({ label, tags, onAdd, onRemove, error, min, max }) => (
  <div className="form-group">
    <label>{label} <span className="req">*</span></label>
    <div className="tag-container">
      {tags.map(tag => (
        <span key={tag} className="tag">{tag} <button type="button" onClick={() => onRemove(tag)}>×</button></span>
      ))}
      <input
        type="text"
        placeholder="Type & press Enter to add"
        className="tag-input"
        onKeyDown={(e) => e.key === 'Enter' && onAdd(e.target.value.trim())}
      />
    </div>
    {tags.length < min && <span className="error-msg">Minimum {min} required</span>}
    {error && <span className="error-msg">{error}</span>}
  </div>
);


export default {FormField,TagInput,CheckboxGroup,SelectField};