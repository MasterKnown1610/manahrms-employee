import React from 'react';
import ProfileInfoCard from './ProfileInfoCard';

function ProfileOrganizationDetails({
  employeeId = 'MH-8829',
  department = 'Design',
  designation = 'Senior Product Designer',
  joiningDate = 'Jan 15, 2021',
}) {
  const rows = [
    { iconName: 'badge', label: 'Employee ID', value: employeeId },
    { iconName: 'business', label: 'Department', value: department },
    { iconName: 'work', label: 'Designation', value: designation },
    { iconName: 'event', label: 'Joining Date', value: joiningDate },
  ];

  return (
    <ProfileInfoCard sectionTitle="ORGANIZATION DETAILS" rows={rows} />
  );
}

export default ProfileOrganizationDetails;
