import { useMemo } from 'react';
import LoginState from './login/state';
import DashboardState from './Dashboard/state';
import AttendenceState from './Attendence/state';
import TaskState from './Task/state';
import LeaveState from './Leave/state';
import AIChatState from './AIChat/state';

export const useCombinedState = () => {
  const login = LoginState();
  const dashboard = DashboardState();
  const attendence = AttendenceState();
  const task = TaskState();
  const leave = LeaveState();
  const aiChat = AIChatState();
  return useMemo(() => ({
    login,
    dashboard,
    attendence,
    task,
    leave,
    aiChat,
  }), [login, dashboard, attendence, task, leave, aiChat]);
};


export default useCombinedState;