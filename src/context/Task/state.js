import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { TaskActions } from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  tasks: null,
  loading: false,
  error: null,
  taskDetail: null,
  detailLoading: false,
  detailError: null,
  statusUpdating: false,
};

export const TaskState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const getTasks = async ( page = 1, page_size = 20, status ) => {
    try {
      if (!token) {
        dispatch({
          type: TaskActions.SET_ERROR,
          payload: 'Not authenticated',
        });
        return { success: false, error: 'Not authenticated' };
      }
      dispatch({ type: TaskActions.SET_LOADING });

      const params = new URLSearchParams({ page, page_size });
      if (status) params.set('status', status);
      const url = `${API_URLS.Task}/my-tasks?${params.toString()}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: TaskActions.SET_TASKS,
        payload: response.data.data
      });
      return response.data.data;
    } catch (error) {
      const message = error?.response?.data?.message ?? error?.message ?? 'Failed to fetch tasks';
      dispatch({
        type: TaskActions.SET_ERROR,
        payload: message,
      });
      return { success: false, error: message };
    }
  };

  const getTaskById = async (id) => {
    if (!id) return { success: false, error: 'Invalid task id' };
    try {
      if (!token) {
        dispatch({ type: TaskActions.SET_ERROR, payload: 'Not authenticated' });
        return { success: false, error: 'Not authenticated' };
      }
      dispatch({ type: TaskActions.SET_DETAIL_LOADING });
      const url = `${API_URLS.Task}/${id}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response?.data;
      // API returns { data: { id, title, ... } }; store the inner task for the modal
      const taskPayload = data?.data ?? data;
      dispatch({ type: TaskActions.SET_TASK_DETAIL, payload: taskPayload });
      return taskPayload;
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to fetch task';
      dispatch({ type: TaskActions.SET_DETAIL_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    if (!taskId || !status) return { success: false, error: 'Invalid input' };
    try {
      if (!token) {
        dispatch({ type: TaskActions.SET_ERROR, payload: 'Not authenticated' });
        return { success: false, error: 'Not authenticated' };
      }
      dispatch({ type: TaskActions.SET_STATUS_UPDATING, payload: true });
      const url = `${API_URLS.Task}/${taskId}`;
      const response = await axios.put(url, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response?.data?.data ?? response?.data;
      if (data) {
        dispatch({ type: TaskActions.SET_TASK_DETAIL, payload: data });
      }
      dispatch({ type: TaskActions.SET_STATUS_UPDATING, payload: false });
      return { success: true, data };
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to update status';
      dispatch({ type: TaskActions.SET_STATUS_UPDATING, payload: false });
      dispatch({ type: TaskActions.SET_DETAIL_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  const clearTaskDetail = () => {
    dispatch({ type: TaskActions.CLEAR_TASK_DETAIL });
  };

  return {
    ...state,
    getTasks,
    getTaskById,
    updateTaskStatus,
    clearTaskDetail,
  };
};

export default TaskState;
