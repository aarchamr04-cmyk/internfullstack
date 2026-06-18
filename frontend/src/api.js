/**
 * Central API base URL helper.
 *
 * - In LOCAL dev  → Vite proxy rewrites /api/* → http://localhost:5000/api/*
 *   so BASE is just '' (empty string — relative URLs work fine).
 *
 * - In PRODUCTION → set VITE_API_URL=https://your-backend.onrender.com
 *   in Vercel environment variables. All fetch calls become absolute.
 */
const BASE = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path) => `${BASE}${path}`;
