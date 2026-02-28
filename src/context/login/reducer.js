import { initialState } from './state'

const loginHandlers = {
  SET_LOGIN: (state, action) => ({
    ...state,
    login: action.payload,
  }),
  SET_LOADING: (state, action) => ({
    ...state,
    loading: true,
  }),
  SET_PROFILE: (state, action) => ({
    ...state,
    profile: action.payload,
  }),
}

const  Reducer = (state, action) => {
  const handler= loginHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
