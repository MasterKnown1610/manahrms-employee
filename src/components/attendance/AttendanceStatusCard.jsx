import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function TimeBox({ label, time, iconName, accentColor, colors }) {
  return (
    <View style={[styles.timeBox, { backgroundColor: colors.backgroundInput }]}>
      <View style={[styles.timeIconWrap, { backgroundColor: accentColor + '18' }]}>
        <Icon name={iconName} size={16} color={accentColor} />
      </View>
      <Text style={[styles.timeBoxLabel, { color: colors.textSecondary }]}>{label}</Text>
      {time ? (
        <Text style={[styles.timeBoxValue, { color: colors.text }]}>{time}</Text>
      ) : (
        <Text style={[styles.timeBoxEmpty, { color: colors.placeholder }]}>-- : --</Text>
      )}
    </View>
  );
}

function PunchButton({ label, iconName, bgColor, onPress, loading, disabled }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        style={[styles.punchBtn, { backgroundColor: bgColor, opacity: disabled ? 0.6 : 1 }]}
      >
        {loading ? (
          <Loader size="small" color="#fff" />
        ) : (
          <>
            <Icon name={iconName} size={20} color="#fff" />
            <Text style={styles.punchBtnLabel}>{label}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

function AttendanceStatusCard({
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

  let statusLabel, statusColor, statusIcon, statusBg;
  if (alreadyCheckedOut) {
    statusLabel = 'Present';
    statusColor = '#2E7D32';
    statusIcon = 'check-circle';
    statusBg = '#E8F5E9';
  } else if (isCheckedIn) {
    statusLabel = 'On Duty';
    statusColor = colors.primary;
    statusIcon = 'work';
    statusBg = colors.primaryLight;
  } else {
    statusLabel = 'Not Checked In';
    statusColor = '#E65100';
    statusIcon = 'schedule';
    statusBg = '#FFF3E0';
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>

      {/* Status pill */}
      <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
        <Icon name={statusIcon} size={14} color={statusColor} />
        <Text style={[styles.statusPillText, { color: statusColor }]}>{statusLabel}</Text>
      </View>

      {/* Time boxes */}
      <View style={styles.timesRow}>
        <TimeBox
          label="Punch In"
          time={punchInTime}
          iconName="login"
          accentColor="#2E7D32"
          colors={colors}
        />
        <View style={[styles.timeDivider, { backgroundColor: colors.border }]} />
        <TimeBox
          label="Punch Out"
          time={punchOutTime}
          iconName="logout"
          accentColor="#C62828"
          colors={colors}
        />
      </View>

      {/* Error */}
      {checkInError ? (
        <View style={[styles.errorBanner, { backgroundColor: '#FFEBEE' }]}>
          <Icon name="error-outline" size={14} color="#C62828" />
          <Text style={styles.errorText}>{checkInError}</Text>
        </View>
      ) : null}

      {/* Action button */}
      {!alreadyCheckedOut && !punchInTime && (
        <PunchButton
          label="Check In"
          iconName="login"
          bgColor="#2E7D32"
          onPress={onCheckIn}
          loading={checkInLoading}
        />
      )}
      {isCheckedIn && !alreadyCheckedOut && punchInTime && (
        <PunchButton
          label="Check Out"
          iconName="logout"
          bgColor={colors.error}
          onPress={onCheckOut}
          loading={checkOutLoading}
        />
      )}
      {alreadyCheckedOut && (
        <View style={[styles.completedRow, { backgroundColor: '#E8F5E9' }]}>
          <Icon name="check-circle" size={16} color="#2E7D32" />
          <Text style={[styles.completedText, { color: '#2E7D32' }]}>Attendance recorded for today</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.md,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeDivider: {
    width: 1,
    height: 52,
    borderRadius: 1,
  },
  timeBox: {
    flex: 1,
    borderRadius: 14,
    padding: spacing.md,
    gap: 4,
  },
  timeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  timeBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  timeBoxValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  timeBoxEmpty: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  punchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 15,
    borderRadius: 14,
  },
  punchBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '500',
    flex: 1,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  completedText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default AttendanceStatusCard;
