import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, borderRadius } from '../../theme/theme';

/**
 * Single row: { iconName, label, value } for display-only, or
 * { iconName, label, onPress } for navigable row (shows arrow).
 */
function ProfileInfoRow({ iconName, label, value, onPress }) {
  const isNav = Boolean(onPress);
  const Wrapper = isNav ? Pressable : View;

  const content = (
    <>
      <View style={styles.iconBox}>
        <Icon name={iconName} size={20} color={colors.background} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        {value != null && <Text style={styles.value}>{value}</Text>}
      </View>
      {isNav && (
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      )}
    </>
  );

  if (isNav) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.rowPressed,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

function ProfileInfoCard({ sectionTitle, rows }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      {rows.map((row, index) => (
        <View key={row.label}>
          <ProfileInfoRow
            iconName={row.iconName}
            label={row.label}
            value={row.value}
            onPress={row.onPress}
          />
          {index < rows.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowPressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  value: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 36 + spacing.md,
  },
});

export default ProfileInfoCard;
export { ProfileInfoRow };
