import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function AttendanceStatusCard({
  dateLabel = 'Today, Oct 24, 2024',
  onCheckIn,
  onCheckOut,
  isCheckedIn = false,
  checkInLoading = false,
  checkOutLoading = false,
  checkInError = null,
  punchInTime = null,
  punchOutTime = null,
  alreadyCheckedOut = false,
}) {
  const { colors } = useTheme();
  const statusLabel = alreadyCheckedOut ? 'Present' : isCheckedIn ? 'On duty' : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.topRow}>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dateLabel}</Text>
        {statusLabel ? (
          <View style={[styles.badge, { backgroundColor: colors.primaryLight }, alreadyCheckedOut && { backgroundColor: colors.success }]}>
            <Text style={[styles.badgeText, { color: colors.primary }, alreadyCheckedOut && { color: colors.background }]}>{statusLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.timesSection, { backgroundColor: colors.backgroundInput }]}>
        <View style={styles.timeBlock}>
          <View style={styles.timeRow}>
            <Icon name="login" size={18} color={colors.primary} />
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Punch In</Text>
          </View>
          {punchInTime ? (
            <Text style={[styles.timeValue, { color: colors.text }]}>{punchInTime}</Text>
          ) : !alreadyCheckedOut ? (
            <Pressable
              onPress={onCheckIn}
              style={[styles.inlineButton, styles.checkInButton, { backgroundColor: colors.primary }, checkInLoading && styles.buttonDisabled]}
              disabled={checkInLoading}
            >
              {checkInLoading ? (
                <Loader size="small" />
              ) : (
                <>
                  <Icon name="schedule" size={20} color={colors.background} />
                  <Text style={[styles.buttonLabel, { color: colors.background }]}>Check In</Text>
                </>
              )}
            </Pressable>
          ) : null}
        </View>
        <View style={styles.timeBlock}>
          <View style={styles.timeRow}>
            <Icon name="logout" size={18} color={colors.primary} />
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Punch Out</Text>
          </View>
          {punchOutTime ? (
            <Text style={[styles.timeValue, { color: colors.text }]}>{punchOutTime}</Text>
          ) : isCheckedIn ? (
            <Pressable
              onPress={onCheckOut}
              style={[styles.inlineButton, styles.checkOutButton, { backgroundColor: colors.error }, checkOutLoading && styles.buttonDisabled]}
              disabled={checkOutLoading}
            >
              {checkOutLoading ? (
                <Loader size="small" />
              ) : (
                <>
                  <Icon name="schedule" size={20} color={colors.background} />
                  <Text style={[styles.buttonLabel, { color: colors.background }]}>Check Out</Text>
                </>
              )}
            </Pressable>
          ) : null}
        </View>
      </View>

      {checkInError ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{checkInError}</Text>
      ) : null}

      {alreadyCheckedOut && (
        <Text style={[styles.presentNote, { color: colors.textSecondary }]}>You have checked out for today.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timesSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
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
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
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
    marginBottom: spacing.sm,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  presentNote: {
    fontSize: 13,
    marginTop: spacing.xs,
  },
});

export default AttendanceStatusCard;
