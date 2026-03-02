import { useReducer, useCallback } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { ProjectActions } from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  projectsQuery: null,
  loading: false,
  error: null,
};

export const ProjectsState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const defaultPayload = { page: 1, page_size: 10 };

  const queryProjects = useCallback(async (params = {}) => {
    try {
      dispatch({ type: ProjectActions.SET_LOADING });

      const payload = { ...defaultPayload, ...params };
      const searchParams = new URLSearchParams(payload);
      const url = searchParams.toString()
        ? `${API_URLS.Projects}/query?${searchParams.toString()}`
        : `${API_URLS.Projects}/query`;

      const response = await axios.post(`${API_URLS.Projects}/query`, payload, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      dispatch({
        type: ProjectActions.SET_PROJECTS_QUERY,
        payload: response?.data,
      });

      return { success: true, data: response?.data };
    } catch (error) {
      console.error('Error fetching projects', error);
      dispatch({
        type: ProjectActions.SET_ERROR,
        payload: error?.response?.data?.message || error.message || 'Failed to load projects',
      });
      return { success: false, error: error?.message };
    }
  }, [token]);

  return {
    ...state,
    queryProjects,
  };
};

export default ProjectsState;
