import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

function ProfileFooter({ version = '2.4.0', build = '80' }) {
  return (
    <Text style={styles.footer}>
      App version {version} (Build {build})
    </Text>
  );
}

const styles = StyleSheet.create({
  footer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});

export default ProfileFooter;
