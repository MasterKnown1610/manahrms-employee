import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/app/DashboardScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import AttendanceScreen from '../screens/app/AttendanceScreen';
import TasksScreen from '../screens/app/TasksScreen';
import LeaveScreen from '../screens/app/LeaveScreen';
import AIChatScreen from '../screens/app/AIChatScreen';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.background,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.cardBackground },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Leave"
        component={LeaveScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AppStack;
