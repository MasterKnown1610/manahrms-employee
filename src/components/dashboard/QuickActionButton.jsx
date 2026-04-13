import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function QuickActionButton({ iconName, isLogo, label, subtitle, onPress, accentColor }) {
  const { colors } = useTheme();
  const accent = accentColor || colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.background, borderColor: colors.border },
        pressed && { opacity: 0.78 },
      ]}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      {/* Icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: accent + '18' }]}>
        {isLogo ? (
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
        ) : (
          <Icon name={iconName} size={22} color={accent} />
        )}
      </View>

      {/* Label */}
      <View style={styles.textWrap}>
        <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>{label}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: spacing.sm + 2,
    paddingRight: spacing.sm,
    gap: spacing.sm,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '500',
  },
});

export default QuickActionButton;
