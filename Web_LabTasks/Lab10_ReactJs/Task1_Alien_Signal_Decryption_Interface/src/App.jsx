import React, { useState, useEffect } from 'react';
import Card from './Card';
import './App.css'

export default function AlienSignalDecryption() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  const [isChecking, setIsChecking] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const initializeGame = () => {
    const signals = ['👽', '🛸', '🌌', '👾', '🪐', '☄️', '🔭', '🌠'];
    const pairs = [...signals, ...signals];

    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    setCards(pairs.map((sig, idx) => ({ id: idx, signal: sig })));
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let intervalId;
    if (timerActive && !gameCompleted) {
      intervalId = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerActive, gameCompleted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstIdx, secondIdx] = flippedCards;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.signal === card2.signal) {
        setScore(prev => prev + 100);
        setMatchedCards(prev => [...prev, firstIdx, secondIdx]);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        setScore(prev => prev - 10);
        const timeoutId = setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000); // Hide after 1 second
        return () => clearTimeout(timeoutId);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      setGameCompleted(true);
      setTimerActive(false);
      const timeBonus = Math.max(0, 200 - (time * 2));
      setScore(prev => prev + timeBonus);
    }
  }, [matchedCards, cards.length, time]);

  const handleCardClick = (index) => {
    if (isChecking || flippedCards.includes(index) || matchedCards.includes(index)) return;
    if (flippedCards.length >= 2) return;

    if (!timerActive) setTimerActive(true);
    setFlippedCards(prev => [...prev, index]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>👽 Alien Signal Decryption Interface</h1>
        <div className="hud">
          <div className="stat-box"> Time: <strong>{time}s</strong></div>
          <div className="stat-box"> Score: <strong>{score}</strong></div>
        </div>
      </header>

      <div className="signal-grid">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            signal={card.signal}
            isFlipped={flippedCards.includes(index)}
            isMatched={matchedCards.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {gameCompleted && (
        <div className="overlay">
          <div className="result-card">
            <h2> Decryption Complete!</h2>
            <p>Final Score: {score}</p>
            <p>Time Taken: {time}s</p>
            <button onClick={initializeGame} className="btn-restart"> New Decryption</button>
          </div>
        </div>
      )}
    </div>
  );
}