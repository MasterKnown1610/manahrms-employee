import React from 'react';
import ProfileInfoCard from './ProfileInfoCard';

function ProfileSettingsSecurity({
  onChangePasswordPress,
  onNotificationSettingsPress,
}) {
  const rows = [
    {
      iconName: 'lock',
      label: 'Change Password',
      onPress: onChangePasswordPress,
    },
    {
      iconName: 'notifications',
      label: 'Notification Settings',
      onPress: onNotificationSettingsPress,
    },
  ];

  return (
    <ProfileInfoCard sectionTitle="SETTINGS & SECURITY" rows={rows} />
  );
}

export default ProfileSettingsSecurity;
