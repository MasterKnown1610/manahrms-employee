import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LeaveHeader,
  LeaveBalancesSection,
  ApplyForLeaveButton,
  NewApplicationForm,
  LeaveHistorySection,
} from '../../components/leave';
import { colors, spacing } from '../../theme/theme';

function LeaveScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleBack = () => navigation.goBack();
  const handleNotification = () => {};
  const handleApplyForLeave = () => {};
  const handleLeaveTypePress = () => {};
  const handleStartDatePress = () => {};
  const handleEndDatePress = () => {};
  const handleAttachmentPress = () => {};

  return (
    <>
    <SafeAreaView style={styles.safeArea} edges={["top"]}/>
       
          <LeaveHeader onBackPress={handleBack} onNotificationPress={handleNotification} />
        
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
       
        <LeaveBalancesSection />
        <ApplyForLeaveButton onPress={handleApplyForLeave} />
        <NewApplicationForm
          leaveType={leaveType}
          onLeaveTypePress={handleLeaveTypePress}
          startDate={startDate}
          endDate={endDate}
          onStartDatePress={handleStartDatePress}
          onEndDatePress={handleEndDatePress}
          reason={reason}
          onReasonChange={setReason}
          onAttachmentPress={handleAttachmentPress}
        />
        <LeaveHistorySection />
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

export default LeaveScreen;
