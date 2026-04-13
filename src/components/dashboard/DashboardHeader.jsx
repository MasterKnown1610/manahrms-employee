import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function getGreetWord() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
}

function getDateShort() {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function DashboardHeader({ userName = 'User', onMenuPress, onNotificationPress }) {
  const { colors } = useTheme();
  const initials = getInitials(userName);
  const firstName = userName.split(' ')[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Menu */}
      <Pressable onPress={onMenuPress} hitSlop={10} style={styles.iconBtn}>
        <Icon name="menu" size={24} color="rgba(255,255,255,0.9)" />
      </Pressable>

      {/* Avatar + text */}
      <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.greetName}>{getGreetWord()}, {firstName} 👋</Text>
        <Text style={styles.dateLine}>{getDateShort()}</Text>
      </View>

      {/* Bell */}
      <Pressable onPress={onNotificationPress} hitSlop={10} style={styles.iconBtn}>
        <Icon name="notifications-none" size={24} color="rgba(255,255,255,0.9)" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    gap: spacing.sm,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  textBlock: {
    flex: 1,
  },
  greetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.1,
  },
  dateLine: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 1,
  },
});

export default DashboardHeader;
