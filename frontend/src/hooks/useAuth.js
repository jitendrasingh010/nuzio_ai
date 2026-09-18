'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('nuzio_token');
      const storedUser = localStorage.getItem('nuzio_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // If on protected route, redirect to /login
        if (pathname !== '/login') {
          router.replace('/login');
        }
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('nuzio_token', newToken);
      localStorage.setItem('nuzio_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await apiRegister(userData);
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('nuzio_token', newToken);
      localStorage.setItem('nuzio_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('nuzio_token');
    localStorage.removeItem('nuzio_user');
    setUser(null);
    setToken(null);
    router.replace('/login');
  };

  const updateStoredUser = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('nuzio_user', JSON.stringify(updated));
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateStoredUser,
  };
};
