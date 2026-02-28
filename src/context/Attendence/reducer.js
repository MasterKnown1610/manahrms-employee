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
  SET_TODAY_ATTENDANCE: (state, action) => ({
    ...state,
    todayAttendance: action.payload,
    loading: false,
    error: null,
  }),
  SET_CALENDAR_ATTENDANCE: (state, action) => ({
    ...state,
    calendarAttendance: action.payload,
    loading: false,
    error: null,
  }),
  SET_PRESENT_ATTENDANCE: (state, action) => ({
    ...state,
    presentAttendance: action.payload,
    loading: false,
    error: null,
  }),
  SET_ATTENDANCE_STATS: (state, action) => ({
    ...state,
    attendanceStats: action.payload,
    loading: false,
    error: null,
  }),
}

const  Reducer = (state, action) => {
  const handler= attendenceHandlers[action.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
