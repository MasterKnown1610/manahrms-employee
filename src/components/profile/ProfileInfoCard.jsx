import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing, borderRadius } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

/**
 * Single row: { iconName, label, value } for display-only, or
 * { iconName, label, onPress } for navigable row (shows arrow).
 */
function ProfileInfoRow({ iconName, label, value, onPress, colors }) {
  const isNav = Boolean(onPress);
  const content = (
    <>
      <View style={[styles.iconBox, { backgroundColor: colors.primary }]}>
        <Icon name={iconName} size={20} color={colors.background} />
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {value != null && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
      </View>
      {isNav && (
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      )}
    </>
  );

  if (isNav) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
        {content}
      </Pressable>
    );
  }
  return <View style={styles.row}>{content}</View>;
}

function ProfileInfoCard({ sectionTitle, rows }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{sectionTitle}</Text>
      {rows.map((row, index) => (
        <View key={row.label}>
          <ProfileInfoRow
            iconName={row.iconName}
            label={row.label}
            value={row.value}
            onPress={row.onPress}
            colors={colors}
          />
          {index < rows.length - 1 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  },
  value: {
    fontSize: 13,
    marginTop: 2,
  },
  separator: {
    height: 1,
    marginLeft: 36 + spacing.md,
  },
});

export default ProfileInfoCard;
export { ProfileInfoRow };
