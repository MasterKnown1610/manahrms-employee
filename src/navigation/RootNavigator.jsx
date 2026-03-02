import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppDrawer from './AppDrawer';
import SplashScreen from '../screens/auth/SplashScreen';

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Always show splash for at least 3 seconds
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading || showSplash) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <AppDrawer /> : <AuthStack />;
}

export default RootNavigator;
