import { initialState } from './state';

const taskHandlers = {
  SET_LOADING: (state) => ({
    ...state,
    loading: true,
  }),
  SET_ERROR: (state, action) => ({
    ...state,
    loading: false,
    error: action.payload,
  }),
  SET_TASKS: (state, action) => ({
    ...state,
    tasks: action.payload,
    loading: false,
    error: null,
  }),
  SET_DETAIL_LOADING: (state) => ({
    ...state,
    detailLoading: true,
    taskDetail: null,
  }),
  SET_TASK_DETAIL: (state, action) => ({
    ...state,
    taskDetail: action.payload,
    detailLoading: false,
    detailError: null,
  }),
  SET_DETAIL_ERROR: (state, action) => ({
    ...state,
    detailError: action.payload,
    detailLoading: false,
    taskDetail: null,
  }),
  SET_STATUS_UPDATING: (state, action) => ({
    ...state,
    statusUpdating: action.payload,
  }),
  CLEAR_TASK_DETAIL: (state) => ({
    ...state,
    taskDetail: null,
    detailLoading: false,
    detailError: null,
    statusUpdating: false,
  }),
};

const Reducer = (state, action) => {
  const handler = taskHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
