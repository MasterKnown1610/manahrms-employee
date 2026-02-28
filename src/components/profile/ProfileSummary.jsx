import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Icon from '../Icon/Icon';
import { colors, spacing } from '../../theme/theme';

function ProfileSummary({
  profileImageUri,
  name = 'Alex Rivera',
  designation = 'Senior Product Designer',
  department = 'DESIGN DEPT',
  onEditPhotoPress,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          {profileImageUri ? (
            <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
          ) : (
            <Icon name="person" size={56} color={colors.primary} />
          )}
        </View>
        <Pressable
          onPress={onEditPhotoPress}
          style={styles.editButton}
          hitSlop={8}
        >
          <Icon name="edit" size={16} color={colors.background} />
        </Pressable>
      </View>
      <Text style={styles.name}>{name}</Text>
      {designation ? <Text style={styles.designation}>{designation}</Text> : null}
      {department ? <Text style={styles.department}>{department}</Text> : null}
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
    backgroundColor: colors.primaryLight,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  designation: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  department: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});

export default ProfileSummary;
