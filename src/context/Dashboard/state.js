import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { DashboardActions } from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  dashboard: null,
};

export const DashboardState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const getDashboard = async () => {
    try {
      dispatch({ type: DashboardActions.SET_LOADING });

      const response = await axios.get(
        `${API_URLS.Dashboard}/employee`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      dispatch({
        type: DashboardActions.SET_DASHBOARD,
        payload: response?.data,
      });

      return response;
    } catch (error) {
      console.error('Error', error);
      dispatch({
        type: DashboardActions.SET_ERROR,
        payload: error.message || 'Failed to load dashboard',
      });
      return { success: false, error: error.message };
    }
  };
  


  return {
    ...state,
    getDashboard,
  };
};

export default DashboardState;
