import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AUTH_STORAGE_KEY = '@manahrms_auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState(null);
  const logoutRef = useRef(null);

  const login = (authData) => {
    const authToken =
      authData?.token ?? authData?.accessToken ?? authData?.access_token ?? null;
    if (authToken) {
      setTokenState(authToken);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token: authToken, authData }));
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setTokenState(null);
    setIsAuthenticated(false);
    AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  logoutRef.current = logout;

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const authData = parsed?.authData ?? {};
          const role = authData?.user?.role ?? authData?.role ?? 'employee';
          if (role === 'admin') {
            AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            setTokenState(null);
            setIsAuthenticated(false);
          } else {
            const savedToken = parsed?.token ?? authData?.token ?? authData?.accessToken ?? authData?.access_token;
            if (savedToken) {
              setTokenState(savedToken);
              setIsAuthenticated(true);
            }
          }
        }
      } catch {
        AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    restoreAuth();
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          logoutRef.current?.();
        }
        return Promise.reject(err);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const setLoading = (value) => {
    setIsLoading(value);
  };

  const value = {
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
    setLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
