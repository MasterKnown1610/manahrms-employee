import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function AttendanceStatusCard({
  dateLabel = 'Today, Oct 24, 2024',
  status = 'ON TIME',
  currentTime = '08:45:21 AM',
  location = 'TechPark, Block B, 4th Floor, San Franci...',
  onCheckIn,
  onCheckOut,
  isCheckedIn = false,
  checkInLoading = false,
  checkInError = null,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status}</Text>
        </View>
      </View>
      <Text style={styles.timeText}>{currentTime}</Text>
      {checkInError ? (
        <Text style={styles.errorText}>{checkInError}</Text>
      ) : null}
      {!isCheckedIn ? (
        <Pressable
          onPress={onCheckIn}
          style={[styles.checkInButton, checkInLoading && styles.buttonDisabled]}
          disabled={checkInLoading}
        >
          <Icon name="schedule" size={22} color={colors.background} />
          <Text style={styles.checkInLabel}>
            {checkInLoading ? 'CHECKING IN...' : 'CHECK IN NOW'}
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={onCheckOut} style={styles.checkOutButton}>
          <Icon name="schedule" size={22} color={colors.background} />
          <Text style={styles.checkInLabel}>CHECK OUT</Text>
        </Pressable>
      )}
      <View style={styles.locationRow}>
        <Icon name="location-on" size={16} color={colors.primary} />
        <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  checkInLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default AttendanceStatusCard;
