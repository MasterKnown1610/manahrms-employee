import { initialState } from './state';

const projectHandlers = {
  SET_LOADING: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  SET_ERROR: (state, action) => ({
    ...state,
    loading: false,
    error: action.payload,
  }),
  SET_PROJECTS_QUERY: (state, action) => ({
    ...state,
    projectsQuery: action.payload,
    loading: false,
    error: null,
  }),
};

const Reducer = (state, action) => {
  const handler = projectHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
