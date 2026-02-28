import { initialState } from './state'

const leaveHandlers = {
  SET_LOADING: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  SET_REQUESTS_LOADING: (state) => ({
    ...state,
    requestsLoading: true,
    error: null,
  }),
  SET_APPLY_LOADING: (state) => ({
    ...state,
    applyLoading: true,
    error: null,
  }),
  SET_BALANCE_LOADING: (state) => ({
    ...state,
    balanceLoading: true,
    error: null,
  }),
  SET_ERROR: (state, action) => ({
    ...state,
    loading: false,
    requestsLoading: false,
    applyLoading: false,
    balanceLoading: false,
    error: action.payload,
  }),
  SET_LEAVE: (state, action) => ({
    ...state,
    leave: action.payload,
    loading: false,
    error: null,
  }),
  SET_LEAVE_APPLY: (state, action) => ({
    ...state,
    leaveApply: action.payload,
    applyLoading: false,
    error: null,
  }),
  SET_LEAVE_REQUESTS: (state, action) => ({
    ...state,
    leaveRequests: action.payload,
    requestsLoading: false,
    error: null,
  }),
  SET_LEAVE_BALANCE: (state, action) => ({
    ...state,
    leaveBalance: action.payload,
    balanceLoading: false,
    error: null,
  }),
}


const  Reducer = (state, action) => {
  const handler= leaveHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
