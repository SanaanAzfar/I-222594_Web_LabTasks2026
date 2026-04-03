import React, { useState } from 'react';

export default function TaskInput({ onAddTask }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text);
      setText('');
    }
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a new task..."
        aria-label="New task"
      />
      <button type="submit" disabled={!text.trim()}>Add Task</button>
    </form>
  );
}