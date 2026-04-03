import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import FilterControls from './FilterControls';
import TaskList from './TaskList';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('taskManager');

    const timer = setTimeout(() => {
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        // Initial predefined tasks
        const initial = [
          { id: 1, text: "Read React documentation", isCompleted: false },
          { id: 2, text: "Build a small project", isCompleted: true },
          { id: 3, text: "Write lab report", isCompleted: false }
        ];
        setTasks(initial);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('taskManager', JSON.stringify(tasks));
    }
  }, [tasks, loading]);

  const handleAddTask = (text) => {
    if (!text.trim()) return;
    const newTask = {
      id: Date.now(),
      text: text.trim(),
      isCompleted: false
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  if (loading) {
    return (
      <div className="app-container">
        <h1>Personal Task Manager</h1>
        <p className="loading">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Personal Task Manager</h1>

      <TaskInput onAddTask={handleAddTask} />

      <FilterControls
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <TaskList
        tasks={filteredTasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}