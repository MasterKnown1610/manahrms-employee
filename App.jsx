/**
 * HRMS Employee App
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import ContextProvider from './src/context/ContextProvider';
import RootNavigator from './src/navigation/RootNavigator';
import { ToastProvider } from './src/components/Toast';

const navFonts = {
  regular: { fontFamily: 'System', fontWeight: '400' },
  medium: { fontFamily: 'System', fontWeight: '500' },
  bold: { fontFamily: 'System', fontWeight: '600' },
  heavy: { fontFamily: 'System', fontWeight: '700' },
};

const NavTheme = {
  dark: true,
  colors: {
    primary: '#B39DDB',
    background: '#121212',
    card: '#2D2D2D',
    text: '#FFFFFF',
    border: '#404040',
    notification: '#EF5350',
  },
  fonts: navFonts,
};

const NavThemeLight = {
  dark: false,
  colors: {
    primary: '#6B4E9E',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#2D2D2D',
    border: '#E0D8EC',
    notification: '#C62828',
  },
  fonts: navFonts,
};

function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#121212' : '#FFFFFF'} />
      <NavigationContainer theme={isDark ? NavTheme : NavThemeLight}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <AuthProvider>
              <ContextProvider>
                <AppContent />
              </ContextProvider>
            </AuthProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
