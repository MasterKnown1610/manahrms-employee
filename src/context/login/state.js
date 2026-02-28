import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { LoginActions } from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  login: null,
  profile: null,
};

export const LoginState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const login = async (username, password) => {
    try {
      dispatch({ type: LoginActions.SET_LOADING });

      const response = await axios.post(
        `${API_URLS.Login}/login`,
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
      return error.response;
    }
  };

  const getProfile = async () => {
    try {
      if (!token) return null;
      const response = await axios.get(`${API_URLS.Login}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: LoginActions.SET_PROFILE,
        payload: response?.data,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  };
  


  return {
    ...state,
    login,
    getProfile,
    loginData: state.login,
  };
};

export default LoginState;
