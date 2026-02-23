import { initialState } from './state'

const dashboardHandlers = {
  SET_DASHBOARD: (state, action) => ({
    ...state,
    dashboard: action.payload,
    loading: false,
    error: null,
  }),
  SET_LOADING: (state, action) => ({
    ...state,
    loading: true,
  }),
  SET_ERROR: (state, action) => ({
    ...state,
    loading: false,
    error: action.payload,
  }),
}

const  Reducer = (state, action) => {
  const handler= dashboardHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
