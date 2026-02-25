import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
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

function getTimeFromPayload(payload) {
  if (!payload) return null;
  if (typeof payload === 'string') {
    const d = new Date(payload);
    return isNaN(d.getTime()) ? payload : formatTime(d);
  }
  const time =
    payload.punchInTime ??
    payload.punchOutTime ??
    payload.inTime ??
    payload.outTime ??
    payload.time ??
    payload.createdAt;
  if (!time) return null;
  const d = new Date(time);
  return isNaN(d.getTime()) ? time : formatTime(d);
}

function AttendanceScreen({ navigation }) {
  const {
    attendence: {
      punchIn,
      punchOut,
      lastPunchIn,
      lastPunchOut,
      todayAttendance,
      fetchTodayAttendance,
      fetchCalendar,
      calendarAttendance,
      loading,
      error,
    } = {},
  } = useContext(Context);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      if (typeof fetchTodayAttendance === 'function') {
        fetchTodayAttendance();
      }
      // Calendar API is fetched when AttendanceCalendar mounts or month changes (onMonthChange)
      if (typeof fetchCalendar === 'function') {
        const now = new Date();
        fetchCalendar(now.getFullYear(), now.getMonth() + 1);
      }
    }, []),
  );

  const handleCalendarMonthChange = useCallback(
    (year, month) => {
      if (typeof fetchCalendar === 'function') {
        fetchCalendar(year, month);
      }
    },
    [],
  );

  const isCheckedIn = !!lastPunchIn && !lastPunchOut;
  const alreadyCheckedOut = !!lastPunchOut;
  const punchInTime =
    getTimeFromPayload(
      todayAttendance?.punch_in_time ??
        todayAttendance?.punchInTime ??
        todayAttendance?.punchIn ??
        todayAttendance?.inTime ??
        lastPunchIn?.data ??
        lastPunchIn,
    ) ?? null;
  const punchOutTime =
    getTimeFromPayload(
      todayAttendance?.punch_out_time ??
        todayAttendance?.punchOutTime ??
        todayAttendance?.punchOut ??
        todayAttendance?.outTime ??
        lastPunchOut?.data ??
        lastPunchOut,
    ) ?? null;

  const markedDates = React.useMemo(() => {
    const dates = calendarAttendance?.presentDates ?? calendarAttendance?.present_dates ?? [];
    return Array.isArray(dates)
      ? dates.map((d) => (typeof d === 'string' ? d : d?.date ?? String(d)))
      : [];
  }, [calendarAttendance?.presentDates, calendarAttendance?.present_dates]);

  const absentDates = React.useMemo(() => {
    const dates = calendarAttendance?.absentDates ?? calendarAttendance?.absent_dates ?? [];
    return Array.isArray(dates)
      ? dates.map((d) => (typeof d === 'string' ? d : d?.date ?? String(d)))
      : [];
  }, [calendarAttendance?.absentDates, calendarAttendance?.absent_dates]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    // Add attendance action
  };

  const handleCheckIn = async () => {
    if (typeof punchIn !== 'function') return;
    try {
      const response = await punchIn();
      if (response?.success === false) {
        // Error already dispatched in context (e.g. double punch), shown via checkInError
        return;
      }
    } catch (err) {
      // Error is stored in attendance context (SET_ERROR)
    }
  };

  const handleCheckOut = async () => {
    if (typeof punchOut !== 'function') return;
    try {
      const response = await punchOut();
      if (response?.success === false) {
        // Error already dispatched in context (e.g. double punch), shown via checkInError
        return;
      }
    } catch (err) {
      // Error is stored in attendance context (SET_ERROR)
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
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          isCheckedIn={isCheckedIn}
          checkInLoading={loading}
          checkInError={error}
          punchInTime={punchInTime}
          punchOutTime={punchOutTime}
          alreadyCheckedOut={alreadyCheckedOut}
        />
        <MonthlySummaryCards
          workDays={calendarAttendance?.workDays ?? 0}
          present={calendarAttendance?.present ?? 0}
          absent={calendarAttendance?.absent ?? 0}
        />
        <AttendanceCalendar
          markedDates={markedDates}
          absentDates={absentDates}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onMonthChange={handleCalendarMonthChange}
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
