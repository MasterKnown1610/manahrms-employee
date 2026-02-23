import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { LoginActions } from './action';
import axios from 'axios';

export const initialState = {
  login: null,
};

export const LoginState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const login = async (username, password) => {
    try {
      dispatch({ type: LoginActions.SET_LOADING });

      const response = await axios.post(
        `${API_URLS.Login}`,
        {
          username,
          password,
        },
      );

      dispatch({
        type: LoginActions.SET_LOGIN,
        payload: response?.data,
      });

      return response;
    } catch (error) {
      console.error('Error', error);
      dispatch({
        type: LoginActions.SET_ERROR,
        payload: error.message || 'Failed to login',
      });
      return { success: false, error: error.message };
    }
  };
  


  return {
    ...state,
    login,
  };
};

export default LoginState;
