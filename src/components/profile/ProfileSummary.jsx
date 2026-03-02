import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function ProfileSummary({
  profileImageUri,
  name = 'Alex Rivera',
  designation = 'Senior Product Designer',
  department = 'DESIGN DEPT',
  onEditPhotoPress,
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
          ) : (
            <Icon name="person" size={56} color={colors.primary} />
          )}
        </View>
        <Pressable
          onPress={onEditPhotoPress}
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          hitSlop={8}
        >
          <Icon name="edit" size={16} color={colors.background} />
        </Pressable>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      {designation ? <Text style={[styles.designation, { color: colors.primary }]}>{designation}</Text> : null}
      {department ? <Text style={[styles.department, { color: colors.textSecondary }]}>{department}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  designation: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  department: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
});

export default ProfileSummary;
