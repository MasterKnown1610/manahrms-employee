import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';
import UpcomingMeetingCard from './UpcomingMeetingCard';

const DEFAULT_MEETING = {
  id: '1',
  title: 'Product Strategy Sync',
  location: 'Room 402 • Zoom',
  time: '10:00 AM - 11:30 AM',
  timeLabel: 'In 45 mins',
  attendeesCount: 4,
};

function UpcomingMeetingsSection({
  meetings = [DEFAULT_MEETING],
  onJoinMeeting,
}) {
  const meeting = meetings[0];
  if (!meeting) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upcoming Meetings</Text>
      <UpcomingMeetingCard
        title={meeting.title}
        location={meeting.location}
        time={meeting.time}
        timeLabel={meeting.timeLabel}
        attendeesCount={meeting.attendeesCount}
        onJoin={() => onJoinMeeting?.(meeting)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
});

export default UpcomingMeetingsSection;
