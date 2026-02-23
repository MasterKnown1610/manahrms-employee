import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState(null);

  const login = (authData) => {
    const authToken =
      authData?.token ?? authData?.accessToken ?? authData?.access_token ?? null;
    if (authToken) setTokenState(authToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setTokenState(null);
    setIsAuthenticated(false);
  };

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
