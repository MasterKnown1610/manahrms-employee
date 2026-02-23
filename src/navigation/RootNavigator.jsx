import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppDrawer from './AppDrawer';
import SplashScreen from '../screens/auth/SplashScreen';

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <AppDrawer /> : <AuthStack />;
}

export default RootNavigator;
