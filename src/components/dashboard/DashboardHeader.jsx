import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing, typography } from '../../theme/theme';

function DashboardHeader({
  userName = 'User',
  greeting = "Good morning, let's get things done.",
  profileImageUri,
  onMenuPress,
}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onMenuPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="menu" size={24} color={colors.background} />
      </Pressable>

      <View style={styles.center}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
            ) : (
              <Icon name="person" size={28} color={colors.background} />
            )}
          </View>
          <View style={styles.greetingBlock}>
            <Text style={styles.hello}>Hello, {userName}</Text>
            <Text style={styles.subGreetingLight}>{greeting}</Text>
          </View>
        </View>
      </View>

      <View style={styles.iconButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    minWidth: 0,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  greetingBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.2,
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  subGreetingLight: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 4,
    lineHeight: 18,
  },
});

export default DashboardHeader;
