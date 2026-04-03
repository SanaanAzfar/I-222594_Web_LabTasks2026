import React from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
      />
      <span className="task-text">{task.text}</span>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.text}"`}
      >
        Delete
      </button>
    </li>
  );
}