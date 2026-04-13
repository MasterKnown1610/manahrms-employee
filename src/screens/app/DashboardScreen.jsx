import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, Alert } from 'react-native';
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
import Icon from '../../components/Icon/Icon';
import { spacing } from '../../theme/theme';
import Context from '../../context/Context';
import { useTheme } from '../../context/ThemeContext';

function getRoleFromContext(loginContext) {
  const profile = loginContext?.profile?.data ?? loginContext?.profile;
  const loginData = loginContext?.loginData?.user ?? loginContext?.loginData;
  return profile?.role ?? loginData?.role ?? 'employee';
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Let's have a great morning!";
  if (hour >= 12 && hour < 17) return "Hope your afternoon is going well.";
  if (hour >= 17 && hour < 21) return "Great work today, keep it up!";
  return "Rest well, see you tomorrow!";
}

function getAttendanceStatus(dashboardData) {
  const summary = dashboardData?.summary ?? dashboardData ?? {};
  const ts = summary?.today_status ?? summary?.todays_status ?? summary?.todayStatus;
  if (!ts || typeof ts !== 'object') return null;
  return {
    isPresent: ts.is_present === true,
    checkIn: ts.check_in_time ?? ts.checkIn ?? null,
    checkOut: ts.check_out_time ?? ts.checkOut ?? null,
  };
}

function formatTime(timeStr) {
  if (!timeStr) return null;
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return timeStr;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return timeStr;
  }
}

// Attendance Status Banner
function AttendanceBanner({ dashboardData, colors, onPress, onClear, dismissed }) {
  const status = getAttendanceStatus(dashboardData);
  if (!status || dismissed) return null;

  const { isPresent, checkIn, checkOut } = status;
  const bg = isPresent ? '#E8F5E9' : '#FFF3E0';
  const border = isPresent ? '#A5D6A7' : '#FFCC80';
  const iconColor = isPresent ? '#2E7D32' : '#E65100';
  const icon = isPresent ? 'check-circle' : 'access-time';
  const label = isPresent ? 'You are marked Present today' : 'Not checked in yet';

  const handleClear = () => {
    Alert.alert(
      'Clear Status',
      'Do you want to clear the attendance status banner?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: onClear },
      ],
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={[styles.banner, { backgroundColor: bg, borderColor: border }]}
    >
      <Icon name={icon} size={20} color={iconColor} />
      <View style={styles.bannerText}>
        <Text style={[styles.bannerTitle, { color: iconColor }]}>{label}</Text>
        {isPresent && checkIn ? (
          <Text style={[styles.bannerSub, { color: iconColor + 'CC' }]}>
            Check-in: {formatTime(checkIn)}
            {checkOut ? `  ·  Out: ${formatTime(checkOut)}` : ''}
          </Text>
        ) : null}
      </View>
      {isPresent ? (
        <Pressable
          onPress={handleClear}
          hitSlop={10}
          style={styles.clearBtn}
        >
          <Icon name="close" size={16} color={iconColor + 'AA'} />
        </Pressable>
      ) : (
        <Icon name="chevron-right" size={18} color={iconColor + '80'} />
      )}
    </Pressable>
  );
}

function DashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { dashboard: dashboardContext, login: loginContext } = useContext(Context);
  const {
    dashboard,
    dashboardAdminOverview,
    loading: dashboardLoading,
    getDashboard,
    getdashboardadminoverview,
  } = dashboardContext ?? {};
  const { getProfile, profile } = loginContext ?? {};
  const role = getRoleFromContext(loginContext ?? {});

  useEffect(() => {
    if (!profile && getProfile) getProfile();
  }, [profile, getProfile]);

  useEffect(() => {
    if (role === 'admin') {
      getdashboardadminoverview?.();
    } else if (!dashboard) {
      getDashboard?.();
    }
  }, [role]);

  const dashboardData = role === 'admin' ? dashboardAdminOverview : dashboard;

  const profileData = profile?.data ?? profile;
  const loginData = loginContext?.loginData?.user ?? loginContext?.loginData;
  const userName =
    profileData?.full_name ?? profileData?.name ??
    loginData?.full_name ?? loginData?.username ?? loginData?.name ?? 'User';

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'profile') navigation.navigate('Profile');
    else if (tabKey === 'attendance') navigation.navigate('Attendance');
    else if (tabKey === 'tasks') navigation.navigate('Tasks');
    else if (tabKey === 'leave') navigation.navigate('Leave');
  };

  const handleQuickActionPress = (actionId) => {
    if (actionId === 'checkin') navigation.navigate('Attendance');
    else if (actionId === 'leave') navigation.navigate('Leave');
    else if (actionId === 'projects') navigation.navigate('Projects');
    else if (actionId === 'aichat') navigation.navigate('AIChat');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundInput }]}>
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']} />

      <DashboardHeader
        userName={userName}
        greeting={getTimeBasedGreeting()}
        onMenuPress={() => navigation.openDrawer?.()}
        onNotificationPress={() => {}}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Attendance banner */}
        <AttendanceBanner
          dashboardData={dashboardData}
          colors={colors}
          onPress={() => navigation.navigate('Attendance')}
          onClear={() => setBannerDismissed(true)}
          dismissed={bannerDismissed}
        />

        {/* Stats section */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Overview</Text>
          </View>
          <SummaryCardsRow dashboard={dashboardData} />
        </View>

        {/* Quick actions */}
        <View style={[styles.sectionWrap, { paddingTop: spacing.lg }]}>
          <QuickActionsSection onActionPress={handleQuickActionPress} />
        </View>

        {/* Tasks + Deadlines */}
        <View style={[styles.sectionWrap, styles.contentPad]}>
          <TodaysTasksSection
            tasks={dashboardData?.recent_tasks ?? []}
            loading={dashboardLoading}
            onViewAll={() => navigation.navigate('Tasks')}
            onTaskPress={(task) => navigation.navigate('TaskDetail', { taskId: task?.id })}
            onTaskCheck={() => {}}
            sectionTitle="Recent Tasks"
          />

          {role === 'admin' ? (
            <RecentActivitiesSection activities={dashboardData?.recent_activities ?? []} />
          ) : (
            <UpcomingMeetingsSection
              deadlines={dashboardData?.upcoming_deadlines}
              onDeadlinePress={() => navigation.navigate('Tasks')}
            />
          )}
        </View>
      </ScrollView>

      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  bannerSub: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  sectionWrap: {
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  contentPad: {
    paddingHorizontal: spacing.lg,
  },
});

export default DashboardScreen;
