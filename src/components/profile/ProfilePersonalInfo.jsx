import React from 'react';
import ProfileInfoCard from './ProfileInfoCard';

function ProfilePersonalInfo({
  email = 'alex.rivera@manahms.com',
  phone = '+1234 567 800',
  dateOfBirth = '12 May 1992',
}) {
  const rows = [
    { iconName: 'email', label: 'Email Address', value: email },
    { iconName: 'phone', label: 'Phone Number', value: phone },
    { iconName: 'cake', label: 'Date of Birth', value: dateOfBirth },
  ];

  return (
    <ProfileInfoCard sectionTitle="PERSONAL INFO" rows={rows} />
  );
}

export default ProfilePersonalInfo;
