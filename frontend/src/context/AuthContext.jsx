import { useState, useCallback } from 'react';
import { AuthContext } from './authContextInstance';
import { apiUrl } from '../api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (email, password) => {
    const response = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await response.json();
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
