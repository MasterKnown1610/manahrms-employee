import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Image, Animated, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LeaveHeader,
  LeaveBalancesSection,
  ApplyForLeaveButton,
  NewApplicationForm,
  LeaveHistorySection,
} from '../../components/leave';
import { parseDateStr } from '../../components/DatePickerField';
import { useToast } from '../../components/Toast';
import { spacing } from '../../theme/theme';
import Context from '../../context/Context';
import { useTheme } from '../../context/ThemeContext';

function toApiDate(mmDdYyyy) {
  if (!mmDdYyyy) return '';
  const parts = mmDdYyyy.split('/');
  if (parts.length !== 3) return '';
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function LogoLoader({ colors }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[loaderStyles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[loaderStyles.ring, { borderColor: colors.primary, transform: [{ rotate }] }]}>
        <Image
          source={require('../../assets/logo.png')}
          style={loaderStyles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={[loaderStyles.label, { color: colors.textSecondary }]}>Loading leave data...</Text>
    </View>
  );
}

const loaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

function LeaveScreen({ navigation }) {
  const { colors } = useTheme();
  const { leave: leaveContext } = useContext(Context);
  const {
    leave: leaveTypesData,
    leaveRequests,
    leaveBalance,
    getLeaveType,
    getLeaveRequests,
    getLeaveBalance,
    applyForLeave,
    loading,
    requestsLoading,
    balanceLoading,
    applyLoading,
  } = leaveContext ?? {};

  const isLoading = !!(loading || requestsLoading || balanceLoading);
  const { showToast } = useToast();
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    getLeaveType?.();
    getLeaveRequests?.();
    getLeaveBalance?.();
  }, []);

  const leaveTypesList = Array.isArray(leaveTypesData)
    ? leaveTypesData
    : (leaveTypesData?.data ?? leaveTypesData?.leaveTypes ?? []);

  const leaveType = selectedLeaveType
    ? (typeof selectedLeaveType === 'object'
        ? (selectedLeaveType?.name ?? selectedLeaveType?.label ?? selectedLeaveType?.type ?? '')
        : String(selectedLeaveType))
    : '';

  const handleBack = () => navigation.goBack();
  const handleNotification = () => {};

  const handleApplyForLeave = async () => {
    if (applyLoading) return;
    const leave_type_id = selectedLeaveType?.id ?? 0;
    const start_date = toApiDate(startDate);
    const end_date = toApiDate(endDate);
    if (!start_date || !end_date) {
      showToast({ type: 'warning', message: 'Please select start and end date.' });
      return;
    }
    const result = await applyForLeave?.({
      leave_type_id,
      start_date,
      end_date,
      reason: reason ?? '',
    });
    if (result?.success) {
      setStartDate('');
      setEndDate('');
      setReason('');
      setSelectedLeaveType(null);
      showToast({ type: 'success', message: 'Leave application submitted.', duration: 3000 });
    } else if (result?.error) {
      showToast({ type: 'error', message: result.error });
    } else if (!applyForLeave) {
      showToast({ type: 'error', message: 'Apply API not available.' });
    }
  };

  const handleLeaveTypeSelect = (item) => setSelectedLeaveType(item);

  const handleStartDateChange = (dateStr) => {
    setStartDate(dateStr);
    const start = parseDateStr(dateStr);
    const end = parseDateStr(endDate);
    if (!endDate || (end && start && end < start)) setEndDate(dateStr);
  };

  const handleEndDateChange = (dateStr) => setEndDate(dateStr);
  const handleAttachmentPress = () => {};

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.primary }]} edges={['top']} />
      <LeaveHeader onBackPress={handleBack} onNotificationPress={handleNotification} />

      {isLoading ? (
        <LogoLoader colors={colors} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LeaveBalancesSection items={leaveBalance} />
          <ApplyForLeaveButton onPress={handleApplyForLeave} loading={!!applyLoading} disabled={!!applyLoading} />
          <NewApplicationForm
            leaveType={leaveType}
            leaveTypes={leaveTypesList}
            onLeaveTypeSelect={handleLeaveTypeSelect}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            minEndDate={parseDateStr(startDate) ?? new Date()}
            reason={reason}
            onReasonChange={setReason}
            onAttachmentPress={handleAttachmentPress}
          />
          <LeaveHistorySection items={leaveRequests} />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {},
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});

export default LeaveScreen;
