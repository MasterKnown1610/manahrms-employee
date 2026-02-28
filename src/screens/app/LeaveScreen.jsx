import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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
import { colors, spacing } from '../../theme/theme';
import Context from '../../context/Context';

function toApiDate(mmDdYyyy) {
  if (!mmDdYyyy) return '';
  const parts = mmDdYyyy.split('/');
  if (parts.length !== 3) return '';
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function LeaveScreen({ navigation }) {
  const { leave: leaveContext } = useContext(Context);
  const {
    leave: leaveTypesData,
    leaveRequests,
    leaveBalance,
    getLeaveType,
    getLeaveRequests,
    getLeaveBalance,
    applyForLeave,
    applyLoading,
  } = leaveContext ?? {};
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
      <SafeAreaView style={styles.safeArea} edges={['top']} />
      <LeaveHeader onBackPress={handleBack} onNotificationPress={handleNotification} />
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});

export default LeaveScreen;
