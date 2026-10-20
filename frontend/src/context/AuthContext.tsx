import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  apiKey?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Query authenticated user via TanStack Query
  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (res.data?.isAuthenticated && res.data?.user) {
          return res.data.user as User;
        }
        return null;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const user = authData || null;
  const isAuthenticated = Boolean(user);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await api.post('/api/auth/login', { username, password });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.setQueryData(['auth', 'me'], data.user);
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.invalidateQueries();
    },
  });

  const login = async (username: string, password: string) => {
    try {
      const res = await loginMutation.mutateAsync({ username, password });
      if (res?.success) {
        return { success: true };
      }
      return { success: false, error: res?.error || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Invalid username or password',
      };
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const res = await api.post('/api/auth/register', data);
      if (res.data?.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, error: res.data?.error || 'Registration failed' };
    } catch (err: any) {
      const msg = err.response?.data?.message;
      return {
        success: false,
        error: Array.isArray(msg)
          ? msg.join(', ')
          : msg || err.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // ignored
    }
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
