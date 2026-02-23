import { initialState } from './state'

const attendenceHandlers = {
  PUNCH_IN: (state, action) => ({
    ...state,
    punchIn: action.payload,
    loading: false,
    error: null,
  }),
  PUNCH_OUT: (state, action) => ({
    ...state,
    punchOut: action.payload,
    punchIn: null,
    loading: false,
    error: null,
  }),
  SET_LOADING: (state) => ({
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
  const handler= attendenceHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
