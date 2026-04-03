import { useState } from 'react'
import React from 'react';
import './App.css'
const ProgressBar = ({ percent }) => {
  const getColor = (p) => {
    if (p <= 25) return '#ef4444';
    if (p <= 50) return '#eab308';
    if (p <= 75) return '#3b82f6';
    return '#22c55e';
  };
  return (
    <div className="progress-wrapper">
      <div className="progress-info">
        <span>Journey Progress</span>
        <span className="progress-text">{Math.round(percent)}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%`, background: getColor(percent) }} />
      </div>
    </div>
  );
};


export default ProgressBar;