import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import { apiUrl } from './api'
import AddTask from './AddTask'
import EditTaskModal from './EditTaskModal'
import './App.css'

export default function TasksPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');

  // Authenticated fetch helper
  const authFetch = (url, options = {}) =>
    fetch(apiUrl(url), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

  // Fetch tasks on mount
  useEffect(() => {
    authFetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        // Backend returns array; local mock also returns array
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error fetching tasks:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTask = (newTask) => setTasks(prev => [newTask, ...prev]);

  const handleUpdateTask = (updatedTask) =>
    setTasks(prev => prev.map(t =>
      (t._id || t.id) === (updatedTask._id || updatedTask.id) ? updatedTask : t
    ));

  const handleDeleteTaskFromState = (taskId) =>
    setTasks(prev => prev.filter(t => (t._id || t.id) !== taskId));

  const handleToggleComplete = async (task) => {
    const id = task._id || task.id;
    const updatedTask = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
    try {
      const res = await authFetch(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error();
      setTasks(prev => prev.map(t => (t._id || t.id) === id ? updatedTask : t));
    } catch {
      alert('Failed to update status. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await authFetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      handleDeleteTaskFromState(taskId);
    } catch {
      alert('Failed to delete task. Please try again.');
    }
  };

  const openEditModal = (task) => { setEditingTask(task); setIsEditOpen(true); };
  const openAddModal  = ()     => setIsAddOpen(true);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        task.title?.toLowerCase().includes(q) ||
        task.description?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (currentFilter === 'pending')       return task.status !== 'completed';
      if (currentFilter === 'completed')     return task.status === 'completed';
      if (currentFilter === 'high-priority') return task.priority === 'high' && task.status !== 'completed';
      return true;
    });
  }, [tasks, searchQuery, currentFilter]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>TaskFlow</h1>
          <p>Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={handleLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
          <button className="btn btn-primary add-task-btn" onClick={openAddModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Task
          </button>
        </div>
      </header>

      <div className="toolbar">
        <div className="search-bar">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['all', 'pending', 'completed', 'high-priority'].map(f => (
            <button
              key={f}
              className={`filter-tab ${currentFilter === f ? 'active' : ''}`}
              onClick={() => setCurrentFilter(f)}
            >
              {f === 'high-priority' ? 'High Priority' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main className="app-main">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No tasks yet</h2>
            <p>Click &quot;New Task&quot; to add your first task.</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No matches found</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map(task => {
              const id = task._id || task.id;
              return (
                <div key={id} className={`task-card ${task.status === 'completed' ? 'is-completed' : ''}`}>
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleComplete(task)}
                    />
                  </div>
                  <div className="task-content-wrapper">
                    <div className="task-header">
                      <h3 className={task.status === 'completed' ? 'text-strikethrough' : ''}>
                        {task.title}
                      </h3>
                      <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                    </div>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    {task.dueDate && (
                      <div className="task-meta">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button className="icon-btn edit-btn" onClick={() => openEditModal(task)} title="Edit task">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDeleteTask(id)} title="Delete task">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isAddOpen && (
        <AddTask
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddTask}
          token={token}
        />
      )}

      {isEditOpen && (
        <EditTaskModal
          isOpen={isEditOpen}
          onClose={() => { setIsEditOpen(false); setEditingTask(null); }}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTaskFromState}
          initialData={editingTask}
          token={token}
        />
      )}
    </div>
  );
}
