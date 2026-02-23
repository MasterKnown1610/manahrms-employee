import { useMemo } from 'react';
import LoginState from './login/state';
import DashboardState from './Dashboard/state';
import AttendenceState from './Attendence/state';

export const useCombinedState = () => {
  const login = LoginState();
  const dashboard = DashboardState();
  const attendence = AttendenceState();

  return useMemo(() => ({
    login,
    dashboard,
    attendence,
  }), [login, dashboard, attendence]);
};


export default useCombinedState;