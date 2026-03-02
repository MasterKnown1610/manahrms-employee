import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { spacing } from '../../theme/theme';
import { useTheme } from '../../context/ThemeContext';

function ProfileFooter({ version = '2.4.0', build = '80' }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.footer, { color: colors.textSecondary }]}>
      App version {version} (Build {build})
    </Text>
  );
}

const styles = StyleSheet.create({
  footer: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});

export default ProfileFooter;
