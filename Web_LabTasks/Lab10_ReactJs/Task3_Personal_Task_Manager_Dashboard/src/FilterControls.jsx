import React from 'react';

export default function FilterControls({ currentFilter, onFilterChange }) {
  const filters = ['all', 'active', 'completed'];

  return (
    <div className="filter-controls">
      {filters.map(f => (
        <button
          key={f}
          className={currentFilter === f ? 'active' : ''}
          onClick={() => onFilterChange(f)}
          aria-pressed={currentFilter === f}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}