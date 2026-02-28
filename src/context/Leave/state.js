import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { LeaveActions } from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  leave: null,
  leaveApply: null,
  leaveRequests: [],
  loading: false,
  requestsLoading: false,
  applyLoading: false,
  balanceLoading: false,
  leaveBalance: null,
  error: null,
};

export const LeaveState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const getLeaveType = async () => {
    try {
      dispatch({ type: LeaveActions.SET_LOADING });

      const response = await axios.get(
        `${API_URLS.Leave}/types`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      dispatch({
        type: LeaveActions.SET_LEAVE,
        payload: response?.data,
      });

      return response;
    } catch (error) {
      console.error('Error', error);
      dispatch({
        type: LeaveActions.SET_ERROR,
        payload: error.message || 'Failed to load leave',
      });
      return { success: false, error: error.message };
    }
  };

  const getLeaveRequests = async () => {
    try {
      dispatch({ type: LeaveActions.SET_REQUESTS_LOADING });

      const response = await axios.get(`${API_URLS.Leave}/requests`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      dispatch({
        type: LeaveActions.SET_LEAVE_REQUESTS,
        payload: response?.data,
      });

      return { success: true, data: response?.data };
    } catch (error) {
      console.error('Error fetching leave requests', error);
      dispatch({
        type: LeaveActions.SET_ERROR,
        payload: error?.response?.data?.message || error.message || 'Failed to load leave requests',
      });
      return { success: false, error: error?.message };
    }
  };

  const getLeaveBalance = async () => {
    try {
      dispatch({ type: LeaveActions.SET_BALANCE_LOADING });

      const response = await axios.get(`${API_URLS.Leave}/balance`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      dispatch({
        type: LeaveActions.SET_LEAVE_BALANCE,
        payload: response?.data,
      });

      return { success: true, data: response?.data };
    } catch (error) {
      console.error('Error fetching leave balance', error);
      dispatch({
        type: LeaveActions.SET_ERROR,
        payload: error?.response?.data?.message || error.message || 'Failed to load leave balance',
      });
      return { success: false, error: error?.message };
    }
  };

  const applyForLeave = async (payload) => {
    try {
      dispatch({ type: LeaveActions.SET_APPLY_LOADING });

      const response = await axios.post(
        `${API_URLS.Leave}/apply`,
        {
          leave_type_id: payload.leave_type_id ?? 0,
          start_date: payload.start_date,
          end_date: payload.end_date,
          reason: payload.reason ?? '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      dispatch({
        type: LeaveActions.SET_LEAVE_APPLY,
        payload: response?.data,
      });
      return { success: true, data: response?.data };
    } catch (error) {
      console.error('Error applying for leave', error);
      dispatch({
        type: LeaveActions.SET_ERROR,
        payload: error?.response?.data?.message || error.message || 'Failed to apply',
      });
      return { success: false, error: error?.response?.data?.message || error?.message };
    }
  };

  return {
    ...state,
    getLeaveType,
    getLeaveRequests,
    getLeaveBalance,
    applyForLeave,
  };
};

export default LeaveState;
