import { createContext } from 'react';

// Singleton context instance — imported by both AuthProvider and useAuth
export const AuthContext = createContext(null);
