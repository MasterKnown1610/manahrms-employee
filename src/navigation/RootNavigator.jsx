import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import Context from '../context/Context';
import AuthStack from './AuthStack';
import AppDrawer from './AppDrawer';
import SplashScreen from '../screens/auth/SplashScreen';

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { dashboard: dashboardContext, login: loginContext } = useContext(Context);

  // Always show splash for at least 3 seconds
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Pre-fetch dashboard data while the splash screen is visible so the
  // dashboard renders immediately after navigation (no second load flash).
  useEffect(() => {
    if (!isAuthenticated) return;
    dashboardContext?.getDashboard?.();
    loginContext?.getProfile?.();
  }, [isAuthenticated]);

  if (isLoading || showSplash) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <AppDrawer /> : <AuthStack />;
}

export default RootNavigator;
