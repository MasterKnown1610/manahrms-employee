import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ProfileHeader,
  ProfileSummary,
  ProfilePersonalInfo,
  ProfileOrganizationDetails,
  ProfileSettingsSecurity,
  ProfileLogoutButton,
  ProfileFooter,
} from '../../components/profile';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme/theme';

function ProfileScreen({ navigation }) {
  const { logout } = useAuth();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    // Open profile menu (e.g. bottom sheet or options)
  };

  const handleEditPhotoPress = () => {
    // Open image picker or edit profile photo
  };

  const handleChangePassword = () => {
    // Navigate to change password screen
  };

  const handleNotificationSettings = () => {
    // Navigate to notification settings screen
  };

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <>
    <SafeAreaView style={styles.safeArea} edges={['top']}/>
      <ProfileHeader onBackPress={handleBack} onMenuPress={handleMenuPress} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSummary onEditPhotoPress={handleEditPhotoPress} />

        <View style={styles.cards}>
          <ProfilePersonalInfo />
          <ProfileOrganizationDetails />
          <ProfileSettingsSecurity
            onChangePasswordPress={handleChangePassword}
            onNotificationSettingsPress={handleNotificationSettings}
          />
        </View>

        <ProfileLogoutButton onPress={handleLogout} />
        <ProfileFooter version="2.4.0" build="80" />
      </ScrollView>
    
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cards: {
    marginTop: spacing.xs,
  },
});

export default ProfileScreen;
