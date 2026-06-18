import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');
    try {
      await updateProfile(name);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Profile</h1>
          <p>Manage your account settings</p>
        </div>
        <div className="header-actions">
          <Link to="/tasks" className="btn btn-secondary">
            Back to Tasks
          </Link>
          <button className="btn btn-ghost" onClick={handleLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2>{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>

          <form onSubmit={handleSubmit} className="profile-form">
            {message && <div className="profile-message success">{message}</div>}
            {error && <div className="profile-message error">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
              />
              <small className="help-text">Email address cannot be changed.</small>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
