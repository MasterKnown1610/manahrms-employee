import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AttendanceHeader,
  AttendanceStatusCard,
  MonthlySummaryCards,
  AttendanceCalendar,
  RecentLogsSection,
} from '../../components/attendance';
import { colors, spacing } from '../../theme/theme';
import Context from '../../context/Context';

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function formatDateLabel(date) {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  if (isToday) {
    return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function AttendanceScreen({ navigation }) {
  const {
    attendence: {
      punchIn,
      punchOut,
      lastPunchIn,
      loading,
      error,
    } = {},
  } = useContext(Context);
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isCheckedIn = !!lastPunchIn;

  // Mock marked dates (days with attendance)
  const markedDates = [
    '2024-10-01', '2024-10-02', '2024-10-03', '2024-10-04', '2024-10-05',
    '2024-10-06', '2024-10-07', '2024-10-08', '2024-10-09', '2024-10-10',
    '2024-10-11', '2024-10-14', '2024-10-15', '2024-10-16', '2024-10-17',
    '2024-10-18', '2024-10-21', '2024-10-22', '2024-10-23', '2024-10-24',
  ];

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    // Add attendance action
  };

  const handleCheckIn = async () => {
    if (typeof punchIn !== 'function') return;
    try {
      await punchIn();
    } catch (err) {
      // Error is stored in attendance context (SET_ERROR)
    }
  };

  const handleCheckOut = async () => {
    if (typeof punchOut === 'function') {
      await punchOut();
    }
  };

  const handleViewAllLogs = () => {
    // Navigate to full logs
  };

  return (
    <>
    <SafeAreaView style={styles.safeArea} edges={["top"]}/>
       
          <AttendanceHeader
            onBackPress={handleBack}
            onAddPress={handleAdd}
          />
        
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      
        <AttendanceStatusCard
          dateLabel={formatDateLabel(new Date())}
          status="ON TIME"
          currentTime={currentTime}
          location="TechPark, Block B, 4th Floor, San Franci..."
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isCheckedIn={isCheckedIn}
          checkInLoading={loading}
          checkInError={error}
        />
        <MonthlySummaryCards workDays={22} present={18} absent={1} />
        <AttendanceCalendar
          markedDates={markedDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        <RecentLogsSection onViewAll={handleViewAllLogs} />
      </ScrollView>
    
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
    paddingHorizontal: spacing.lg,
  },
  headerWrap: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: -spacing.lg,
    marginBottom: 0,
    paddingBottom: spacing.xs,
    overflow: 'hidden',
  },
});

export default AttendanceScreen;
