import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function AttendanceHeader({
  onBackPress,
  onAddPress,
  profileImageUri,
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Pressable onPress={onBackPress} style={styles.iconButton} hitSlop={8}>
        <Icon name="arrow-back" size={24} color={colors.background} />
      </Pressable>

      <Text style={[styles.title, { color: colors.background }]}>Attendance</Text>

      <View style={styles.rightRow}>
        {/* <Pressable onPress={onAddPress} style={styles.addButton} hitSlop={8}>
          <Icon name="add" size={20} color={colors.background} />
        </Pressable>
        <View style={styles.avatar}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
          ) : (
            <Icon name="person" size={24} color={colors.background} />
          )}
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default AttendanceHeader;
