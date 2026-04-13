import { useReducer, useCallback } from 'react';
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
  commentSubmitting: false,
  commitSubmitting: false,
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

  const getTasksByQuery = async (options = {}) => {
    try {
      if (!token) {
        dispatch({
          type: TaskActions.SET_ERROR,
          payload: 'Not authenticated',
        });
        return { success: false, error: 'Not authenticated' };
      }
      dispatch({ type: TaskActions.SET_LOADING });

      const {
        filter = [],
        page = 1,
        page_size = 20,
        sort = [{ field: 'created_at', order: 'desc' }],
      } = options;

      const url = `${API_URLS.Task}/query`;
      const response = await axios.post(
        url,
        { filter, page, page_size, sort },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = response?.data?.data ?? response?.data ?? [];
      dispatch({
        type: TaskActions.SET_TASKS,
        payload: Array.isArray(data) ? data : (data?.items ?? data?.tasks ?? []),
      });
      return Array.isArray(data) ? data : (data?.items ?? data?.tasks ?? []);
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

  const createComment = async (taskId, content) => {
    if (!taskId || !content) return { success: false, error: 'Invalid input' };
    try {
      if (!token) return { success: false, error: 'Not authenticated' };
      dispatch({ type: TaskActions.SET_COMMENT_SUBMITTING, payload: true });
      const url = `${API_URLS.Task}/${taskId}/comments`;
      const response = await axios.post(url, { content }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = response?.data?.data ?? response?.data;
      dispatch({ type: TaskActions.ADD_COMMENT, payload: data });
      return { success: true, data };
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to add comment';
      dispatch({ type: TaskActions.SET_COMMENT_SUBMITTING, payload: false });
      return { success: false, error: message };
    }
  };

  const createCommit = async (taskId, commitData) => {
    if (!taskId || !commitData) return { success: false, error: 'Invalid input' };
    try {
      if (!token) return { success: false, error: 'Not authenticated' };
      dispatch({ type: TaskActions.SET_COMMIT_SUBMITTING, payload: true });
      const url = `${API_URLS.Task}/${taskId}/commits`;
      const response = await axios.post(url, commitData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = response?.data?.data ?? response?.data;
      dispatch({ type: TaskActions.ADD_COMMIT, payload: data });
      return { success: true, data };
    } catch (err) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to add commit';
      dispatch({ type: TaskActions.SET_COMMIT_SUBMITTING, payload: false });
      return { success: false, error: message };
    }
  };

  const clearTaskDetail = () => {
    dispatch({ type: TaskActions.CLEAR_TASK_DETAIL });
  };

  const reset = useCallback(() => dispatch({ type: TaskActions.RESET }), []);

  return {
    ...state,
    getTasks,
    getTasksByQuery,
    getTaskById,
    updateTaskStatus,
    createComment,
    createCommit,
    clearTaskDetail,
    reset,
  };
};

export default TaskState;
