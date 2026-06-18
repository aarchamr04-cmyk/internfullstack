import { useState } from 'react';
import { apiUrl } from './api';
import './TaskForm.css';

export default function EditTaskModal({ isOpen, onClose, onSave, onDelete, initialData, token }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(() => {
    if (!initialData?.dueDate) return '';
    const d = new Date(initialData.dueDate);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !initialData) return null;

  const taskId = initialData._id || initialData.id;

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    const updatedTask = {
      ...initialData,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
    };

    try {
      const response = await fetch(apiUrl(`/api/tasks/${taskId}`), {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error('Failed to update task');
      const saved = await response.json();
      onSave(saved);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl(`/api/tasks/${taskId}`), {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!response.ok) throw new Error('Failed to delete task');
      onDelete(taskId);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose} disabled={isSubmitting}>&times;</button>

        <div className="modal-header">
          <h2>Edit Task</h2>
          <p>Update the details of your task.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-task-title">Title</label>
            <input
              type="text" id="edit-task-title" className="form-input"
              value={title} onChange={e => setTitle(e.target.value)}
              required autoFocus disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-desc">Description</label>
            <textarea
              id="edit-task-desc" className="form-input"
              value={description} onChange={e => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-priority">Priority</label>
            <select
              id="edit-task-priority" className="form-input select-input"
              value={priority} onChange={e => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-date">Due Date</label>
            <input
              type="date" id="edit-task-date" className="form-input"
              value={dueDate} onChange={e => setDueDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions edit-actions">
            <button type="button" className="btn btn-danger delete-btn-modal"
              onClick={handleDelete} disabled={isSubmitting}>
              Delete
            </button>
            <div className="right-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={!title.trim() || isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
