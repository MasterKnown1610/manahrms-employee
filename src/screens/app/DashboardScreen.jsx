import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DashboardHeader,
  SummaryCardsRow,
  QuickActionsSection,
  TodaysTasksSection,
  UpcomingMeetingsSection,
  RecentActivitiesSection,
  BottomTabBar,
} from '../../components/dashboard';
import { colors, spacing } from '../../theme/theme';
import Context from '../../context/Context';

function getRoleFromContext(loginContext) {
  const profile = loginContext?.profile?.data ?? loginContext?.profile;
  const loginData = loginContext?.loginData?.user ?? loginContext?.loginData;
  return profile?.role ?? loginData?.role ?? 'employee';
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning, let's get things done.";
  if (hour >= 12 && hour < 17) return "Good afternoon, let's get things done.";
  if (hour >= 17 && hour < 21) return "Good evening, let's get things done.";
  return "Good night, let's get things done.";
}

function DashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { dashboard: dashboardContext, login: loginContext } = useContext(Context);
  const { dashboard, dashboardAdminOverview, loading: dashboardLoading, getDashboard, getdashboardadminoverview } = dashboardContext ?? {};
  const { getProfile, profile } = loginContext ?? {};
  const role = getRoleFromContext(loginContext ?? {});

  useEffect(() => {
    if (!profile && getProfile) getProfile();
  }, [profile, getProfile]);

  useEffect(() => {
    if (role === 'admin') {
      getdashboardadminoverview?.();
    } else {
      getDashboard?.();
    }
  }, [role, getDashboard, getdashboardadminoverview]);

  const dashboardData = role === 'admin' ? dashboardAdminOverview : dashboard;

  const handleMenuPress = () => {
    navigation.openDrawer?.();
  };

  const profileData = profile?.data ?? profile;
  const loginData = loginContext?.loginData?.user ?? loginContext?.loginData;
  const userName = profileData?.full_name ?? profileData?.name ?? loginData?.full_name ?? loginData?.username ?? loginData?.name ?? 'User';

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

  const handleDeadlinePress = (deadline) => {
    // Navigate to task or deadline detail
    navigation.navigate('Tasks');
  };

  const handleQuickActionPress = (actionId) => {
    if (actionId === 'checkin') {
      navigation.navigate('Attendance');
    } else if (actionId === 'leave') {
      navigation.navigate('Leave');
    } else if (actionId === 'projects') {
      navigation.navigate('Main', { screen: 'Projects' });
    } else if (actionId === 'aichat') {
      navigation.navigate('AIChat');
    }
  };

  return (
    <>
    <SafeAreaView style={styles.safeArea} edges={["top"]}/>
      
        <DashboardHeader
          userName={userName}
          greeting={getTimeBasedGreeting()}
          onMenuPress={handleMenuPress}
        />
      
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SummaryCardsRow dashboard={dashboardData} />

        <QuickActionsSection onActionPress={handleQuickActionPress} />

        <View style={styles.content}>
          <TodaysTasksSection
            tasks={dashboardData?.recent_tasks ?? []}
            loading={dashboardLoading}
            onViewAll={handleViewAllTasks}
            onTaskPress={handleTaskPress}
            onTaskCheck={handleTaskCheck}
            sectionTitle={role === 'admin' ? 'Recent Tasks' : "Today's Tasks"}
          />

          {role === 'admin' ? (
            <RecentActivitiesSection activities={dashboardData?.recent_activities ?? []} />
          ) : (
            <UpcomingMeetingsSection
              deadlines={dashboardData?.upcoming_deadlines}
              onDeadlinePress={handleDeadlinePress}
            />
          )}
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
