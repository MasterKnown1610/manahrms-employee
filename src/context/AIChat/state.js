import { useReducer } from 'react';
import { API_URLS } from '../../services/config';
import Reducer from './reducer';
import { AIChatActions } from './action';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export const initialState = {
  messages: [],
  loading: false,
  error: null,
};

export const AIChatState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { token } = useAuth();

  const ask = async (message) => {
    const trimmed = (message || '').trim();
    if (!trimmed) return { success: false, error: 'Message is required' };

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
    };
    dispatch({ type: AIChatActions.ADD_MESSAGE, payload: userMsg });
    dispatch({ type: AIChatActions.SET_LOADING });

    try {
      const response = await axios.post(
        `${API_URLS.AIChat}/ask`,
        { question: trimmed },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const data = response?.data?.data ?? response?.data;
      const aiText =
        data?.response ??
        data?.message ??
        data?.reply ??
        data?.answer ??
        (typeof data === 'string' ? data : 'No response from AI.');

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: aiText,
      };
      dispatch({ type: AIChatActions.SET_AI_RESPONSE, payload: aiMsg });
      return { success: true, data: aiText };
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        error?.message ??
        'Failed to get AI response';
      dispatch({ type: AIChatActions.SET_ERROR, payload: errMsg });
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Sorry, something went wrong: ${errMsg}`,
      };
      dispatch({ type: AIChatActions.SET_AI_RESPONSE, payload: aiMsg });
      return { success: false, error: errMsg };
    }
  };

  const clearMessages = () => {
    dispatch({ type: AIChatActions.CLEAR_MESSAGES });
  };

  return {
    ...state,
    ask,
    clearMessages,
  };
};

export default AIChatState;
