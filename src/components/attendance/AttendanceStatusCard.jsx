import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function AttendanceStatusCard({
  dateLabel = 'Today, Oct 24, 2024',
  onCheckIn,
  onCheckOut,
  isCheckedIn = false,
  checkInLoading = false,
  checkInError = null,
  punchInTime = null,
  punchOutTime = null,
  alreadyCheckedOut = false,
}) {
  const statusLabel = alreadyCheckedOut ? 'Present' : isCheckedIn ? 'On duty' : null;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.dateText}>{dateLabel}</Text>
        {statusLabel ? (
          <View style={[styles.badge, alreadyCheckedOut && styles.badgePresent]}>
            <Text style={[styles.badgeText, alreadyCheckedOut && styles.badgeTextPresent]}>{statusLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.timesSection}>
        <View style={styles.timeBlock}>
          <View style={styles.timeRow}>
            <Icon name="login" size={18} color={colors.primary} />
            <Text style={styles.timeLabel}>Punch In</Text>
          </View>
          {punchInTime ? (
            <Text style={styles.timeValue}>{punchInTime}</Text>
          ) : !alreadyCheckedOut ? (
            <Pressable
              onPress={onCheckIn}
              style={[styles.inlineButton, styles.checkInButton, checkInLoading && styles.buttonDisabled]}
              disabled={checkInLoading}
            >
              <Icon name="schedule" size={20} color={colors.background} />
              <Text style={styles.buttonLabel}>
                {checkInLoading ? 'Checking in...' : 'Check In'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.timeBlock}>
          <View style={styles.timeRow}>
            <Icon name="logout" size={18} color={colors.primary} />
            <Text style={styles.timeLabel}>Punch Out</Text>
          </View>
          {punchOutTime ? (
            <Text style={styles.timeValue}>{punchOutTime}</Text>
          ) : isCheckedIn ? (
            <Pressable onPress={onCheckOut} style={[styles.inlineButton, styles.checkOutButton]}>
              <Icon name="schedule" size={20} color={colors.background} />
              <Text style={styles.buttonLabel}>Check Out</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {checkInError ? (
        <Text style={styles.errorText}>{checkInError}</Text>
      ) : null}

      {alreadyCheckedOut && (
        <Text style={styles.presentNote}>You have checked out for today.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  badgePresent: {
    backgroundColor: colors.success,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  badgeTextPresent: {
    color: colors.background,
  },
  timesSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
  },
  timeBlock: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  timeLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.3,
  },
  presentNote: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default AttendanceStatusCard;
