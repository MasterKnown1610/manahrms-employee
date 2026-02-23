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
}

const  Reducer = (state, action) => {
  const handler= loginHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
