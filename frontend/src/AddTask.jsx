import { useState } from 'react';
import { apiUrl } from './api';
import './TaskForm.css';

export default function AddTask({ isOpen, onClose, onSave, token }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl('/api/tasks'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate: dueDate || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      const savedTask = await response.json();
      onSave(savedTask);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} disabled={isSubmitting}>&times;</button>

        <div className="modal-header">
          <h2>Create New Task</h2>
          <p>Add details for your new task below.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Title</label>
            <input
              type="text" id="task-title" className="form-input"
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Design homepage UI"
              required autoFocus disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc" className="form-input"
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Add more details..." disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority" className="form-input select-input"
              value={priority} onChange={e => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-date">Due Date</label>
            <input
              type="date" id="task-date" className="form-input"
              value={dueDate} onChange={e => setDueDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
