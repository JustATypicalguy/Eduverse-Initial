import { useState, useEffect } from 'react';
import type { users } from '@shared/schema';

interface AuthState {
  user: typeof users | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface LoginData {
  username: string;
  password: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for stored auth on component mount
    const storedToken = localStorage.getItem('eduverse_token');
    const storedUser = localStorage.getItem('eduverse_user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          token: storedToken,
          isAuthenticated: true
        });
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('eduverse_token');
        localStorage.removeItem('eduverse_user');
      }
    }
  }, []);

  const login = async (loginData: LoginData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Login failed' };
      }

      const { token, user } = await response.json();
      
      // Store auth data
      localStorage.setItem('eduverse_token', token);
      localStorage.setItem('eduverse_user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true
      });

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('eduverse_token');
    localStorage.removeItem('eduverse_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false
    });
  };

  const getAuthHeaders = () => {
    if (authState.token) {
      return {
        'Authorization': `Bearer ${authState.token}`,
        'Content-Type': 'application/json'
      };
    }
    return {};
  };

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
    getAuthHeaders
  };
}