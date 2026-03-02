import { useMemo } from 'react';
import LoginState from './login/state';
import DashboardState from './Dashboard/state';
import AttendenceState from './Attendence/state';
import TaskState from './Task/state';
import LeaveState from './Leave/state';
import ProjectsState from './Projects/state';
import AIChatState from './AIChat/state';

export const useCombinedState = () => {
  const login = LoginState();
  const dashboard = DashboardState();
  const attendence = AttendenceState();
  const task = TaskState();
  const leave = LeaveState();
  const projects = ProjectsState();
  const aiChat = AIChatState();
  return useMemo(() => ({
    login,
    dashboard,
    attendence,
    task,
    leave,
    projects,
    aiChat,
  }), [login, dashboard, attendence, task, leave, projects, aiChat]);
};


export default useCombinedState;