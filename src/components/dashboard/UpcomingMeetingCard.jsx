import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

function UpcomingMeetingCard({
  title,
  location,
  time,
  timeLabel,
  attendeesCount = 0,
  joinLabel = 'Join',
  onJoin,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.todayBadge}>
          <Text style={styles.todayText}>TODAY</Text>
        </View>
      </View>
      <Text style={styles.location} numberOfLines={1}>
        {location}
      </Text>
      <View style={styles.timeRow}>
        <Icon name="schedule" size={16} color={colors.background} />
        <Text style={styles.timeText}>
          {time}
          {timeLabel ? ` (${timeLabel})` : ''}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.avatars}>
          <View style={styles.avatar} />
          <View style={[styles.avatar, styles.avatarOverlap]} />
          <View style={[styles.avatar, styles.avatarOverlap]} />
          {attendeesCount > 0 ? (
            <View style={[styles.avatar, styles.avatarMore]}>
              <Text style={styles.avatarMoreText}>+{attendeesCount}</Text>
            </View>
          ) : null}
        </View>
        <Pressable onPress={onJoin} style={styles.joinButton}>
          <Text style={styles.joinText}>{joinLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    flex: 1,
    marginRight: spacing.sm,
  },
  todayBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.background,
  },
  location: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeText: {
    fontSize: 13,
    color: colors.background,
    marginLeft: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  avatarMore: {
    marginLeft: -8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.background,
  },
  joinButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  joinText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default UpcomingMeetingCard;
