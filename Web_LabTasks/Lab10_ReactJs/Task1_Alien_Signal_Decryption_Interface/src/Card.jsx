import { useState } from 'react'
import React from 'react';
import './App.css'
const Card = ({ signal, isFlipped, isMatched, onClick }) => {
  return (
    <div
      className={`card ${isMatched ? 'matched' : isFlipped ? 'flipped' : 'hidden'}`}
      onClick={onClick}
    >
      {isFlipped || isMatched ? (
        <span className="signal">{signal}</span>
      ) : (
        <span className="hidden-mark">?</span>
      )}
    </div>
  );
};


export default Card;