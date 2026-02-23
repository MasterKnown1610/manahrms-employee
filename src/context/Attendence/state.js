import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { AttendanceActions} from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  attendence: null,
  loading: false,
  error: null,
};

export const AttendenceState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const punchIn = async () => {
    try {
      dispatch({ type: AttendanceActions.SET_LOADING });

      const response = await axios.get(
        `${API_URLS.Attendance}/punch-in`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      dispatch({
        type: AttendanceActions.PUNCH_IN,
        payload: response?.data,
      });

      return response;
    } catch (error) {
      console.error('Error', error);
      dispatch({
        type: AttendanceActions.SET_ERROR,
        payload: error.message || 'Failed to punch in',
      });
      return { success: false, error: error.message };
    }
  };

  const punchOut = async () => {
    try {
      dispatch({ type: AttendanceActions.SET_LOADING });
      const response = await axios.get(
        `${API_URLS.Attendance}/punch-out`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );
      dispatch({
        type: AttendanceActions.PUNCH_OUT,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      console.error('Error', error);
      dispatch({
        type: AttendanceActions.SET_ERROR,
        payload: error.message || 'Failed to punch out',
      });
      return { success: false, error: error.message };
    }
  };

  return {
    ...state,
    lastPunchIn: state.punchIn,
    lastPunchOut: state.punchOut,
    punchIn,
    punchOut,
  };
};

export default AttendenceState;
