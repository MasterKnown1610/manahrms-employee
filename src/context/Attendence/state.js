import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { AttendanceActions} from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  attendence: null,
  todayAttendance: null,
  calendarAttendance: null, // { workDays, present, absent, presentDates?, absentDates? }
  loading: false,
  error: null,
};

export const AttendenceState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const punchIn = async () => {
    try {
      if (!token) {
        dispatch({
          type: AttendanceActions.SET_ERROR,
          payload: 'Not authenticated',
        });
        return { success: false, error: 'Not authenticated' };
      }
      dispatch({ type: AttendanceActions.SET_LOADING });

      const response = await axios.post(
        `${API_URLS.Attendance}/punch-in`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch({
        type: AttendanceActions.PUNCH_IN,
        payload: response?.data,
      });
      await fetchTodayAttendance();

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unable to punch in';
      dispatch({ type: AttendanceActions.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const punchOut = async () => {
    try {
      if (!token) {
        dispatch({
          type: AttendanceActions.SET_ERROR,
          payload: 'Not authenticated',
        });
        return { success: false, error: 'Not authenticated' };
      }
      dispatch({ type: AttendanceActions.SET_LOADING });
      const response = await axios.post(
        `${API_URLS.Attendance}/punch-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch({
        type: AttendanceActions.PUNCH_OUT,
        payload: response?.data,
      });
      await fetchTodayAttendance();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unable to punch out';
      dispatch({ type: AttendanceActions.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      if (!token) return;
      const response = await axios.get(`${API_URLS.Attendance}/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data?.data ?? response?.data;
      dispatch({
        type: AttendanceActions.SET_TODAY_ATTENDANCE,
        payload: data,
      });
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      dispatch({ type: AttendanceActions.SET_ERROR, payload: message });
    }
  };

  const fetchCalendar = async (year, month) => {
    try {
      if (!token) return;
      const response = await axios.get(`${API_URLS.Attendance}/calendar`, {
        params: { year, month },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const raw = response?.data?.data ?? response?.data ?? {};
      const daysArray = raw.days ?? [];
      const presentFromDays = daysArray.filter((d) => d.is_present === true).map((d) => d.date);
      const absentFromDays = daysArray.filter((d) => d.is_present === false).map((d) => d.date);
      const payload = {
        workDays: raw.workDays ?? raw.work_days ?? raw.total_present_days ?? 0,
        present: raw.present ?? raw.total_present_days ?? presentFromDays.length,
        absent: raw.absent ?? absentFromDays.length,
        presentDates: raw.presentDates ?? raw.present_dates ?? raw.presentDatesList ?? presentFromDays,
        absentDates: raw.absentDates ?? raw.absent_dates ?? raw.absentDatesList ?? absentFromDays,
      };
      dispatch({
        type: AttendanceActions.SET_CALENDAR_ATTENDANCE,
        payload,
      });
      return payload;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      dispatch({ type: AttendanceActions.SET_ERROR, payload: message });
    }
  };

  return {
    ...state,
    lastPunchIn: state.punchIn,
    lastPunchOut: state.punchOut,
    punchIn,
    punchOut,
    fetchTodayAttendance,
    fetchCalendar,
  };
};

export default AttendenceState;
