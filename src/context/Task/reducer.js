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
  ADD_COMMENT: (state, action) => {
    const detail = state.taskDetail;
    if (!detail) return state;
    const comments = Array.isArray(detail.comments) ? [...detail.comments, action.payload] : [action.payload];
    return { ...state, taskDetail: { ...detail, comments }, commentSubmitting: false };
  },
  ADD_COMMIT: (state, action) => {
    const detail = state.taskDetail;
    if (!detail) return state;
    const commits = Array.isArray(detail.commits) ? [...detail.commits, action.payload] : [action.payload];
    return { ...state, taskDetail: { ...detail, commits }, commitSubmitting: false };
  },
  SET_COMMENT_SUBMITTING: (state, action) => ({ ...state, commentSubmitting: action.payload }),
  SET_COMMIT_SUBMITTING: (state, action) => ({ ...state, commitSubmitting: action.payload }),
  RESET: () => initialState,
};

const Reducer = (state, action) => {
  const handler = taskHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
