import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DashboardHeader,
  SummaryCardsRow,
  QuickActionsSection,
  TodaysTasksSection,
  UpcomingMeetingsSection,
  BottomTabBar,
} from '../../components/dashboard';
import { colors, spacing } from '../../theme/theme';
import Context from '../../context/Context';

function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { dashboard: dashboardContext } = useContext(Context);
  const { dashboard, getDashboard } = dashboardContext ?? {};

  useEffect(() => {
    getDashboard?.();
  }, []);

  const handleMenuPress = () => {
    navigation.openDrawer?.();
  };

  const handleNotificationPress = () => {
    // Navigate to notifications
  };

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'profile') navigation.navigate('Profile');
    else if (tabKey === 'attendance') navigation.navigate('Attendance');
    else if (tabKey === 'tasks') navigation.navigate('Tasks');
    else if (tabKey === 'leave') navigation.navigate('Leave');
  };

  const handleViewAllTasks = () => {
    // Navigate to tasks list
  };

  const handleTaskPress = (task) => {
    // Navigate to task detail
  };

  const handleTaskCheck = (task) => {
    // Toggle task completion
  };

  const handleJoinMeeting = (meeting) => {
    // Join meeting (e.g. open Zoom link)
  };

  const handleQuickActionPress = (actionId) => {
    if (actionId === 'checkin') {
      navigation.navigate('Attendance');
    }
    // Add other action handlers as needed (leave, payslip, directory)
  };

  return (
    <>
    <SafeAreaView style={styles.safeArea} edges={["top"]}/>
      
        <DashboardHeader
          userName="Alex"
          greeting="Good morning, let's get things done."
          onMenuPress={handleMenuPress}
          onNotificationPress={handleNotificationPress}
          showNotificationBadge
        />
      
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SummaryCardsRow dashboard={dashboard} />

        <QuickActionsSection onActionPress={handleQuickActionPress} />

        <View style={styles.content}>
          <TodaysTasksSection
            onViewAll={handleViewAllTasks}
            onTaskPress={handleTaskPress}
            onTaskCheck={handleTaskCheck}
          />

          <UpcomingMeetingsSection onJoinMeeting={handleJoinMeeting} />
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    marginTop: 0,
  },
  headerWrap: {
    backgroundColor: colors.primary,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
  },
});

export default DashboardScreen;
