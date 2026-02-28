import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ProfileHeader,
  ProfileSummary,
  ProfileInfoCard,
  ProfileSettingsSecurity,
  ProfileLogoutButton,
  ProfileFooter,
} from '../../components/profile';
import { useAuth } from '../../context/AuthContext';
import Context from '../../context/Context';
import { colors, spacing } from '../../theme/theme';

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return isoString;
  }
}

function getProfileDisplayData(profile) {
  if (!profile) return {};
  const p = profile?.data ?? profile;
  return {
    id: p?.id ?? '—',
    company_id: p?.company_id ?? '—',
    email: p?.email ?? '—',
    // username: p?.username ?? '—',
    full_name: p?.full_name ?? '—',
    // role: p?.role ?? '—',
    is_active: p?.is_active === true ? 'Active' : 'Inactive',
    is_superuser: p?.is_superuser === true ? 'Yes' : 'No',
    force_password_change: p?.force_password_change === true ? 'Yes' : 'No',
    created_at: formatDate(p?.created_at),
  };
}

function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const { login: loginContext } = useContext(Context);
  const { profile, getProfile } = loginContext ?? {};
  const displayData = getProfileDisplayData(profile);

  useFocusEffect(
    React.useCallback(() => {
      getProfile?.();
    }, [])
  );

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
        <ProfileSummary
          name={displayData.full_name}
          designation=""
          department=""
          onEditPhotoPress={handleEditPhotoPress}
        />

        <View style={styles.cards}>
          <ProfileInfoCard
            sectionTitle="PROFILE DETAILS"
            rows={[
              { iconName: 'badge', label: 'ID', value: String(displayData.id) },
              { iconName: 'business', label: 'Company ID', value: String(displayData.company_id) },
              { iconName: 'email', label: 'Email', value: displayData.email },
              { iconName: 'badge', label: 'Full Name', value: displayData.full_name },
              { iconName: 'check-circle', label: 'Status', value: displayData.is_active },
              { iconName: 'star', label: 'Superuser', value: displayData.is_superuser },
              { iconName: 'lock', label: 'Force Password Change', value: displayData.force_password_change },
              { iconName: 'event', label: 'Created At', value: displayData.created_at },
            ]}
          />
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
