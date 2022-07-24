import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  log: {},
  logs: [],
  logsPagination: { page: 1, size: 10, total: 0 },
  logDetailVisible: false,
  logTableLoading: false,
};

const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    setLog: (state, action) => { state.log = action.payload; },
    setLogs: (state, action) => { state.logs = action.payload; },
    setLogsPagination: (state, action) => { state.logsPagination = action.payload; },
    setLogDetailVisible: (state, action) => { state.logDetailVisible = action.payload; },
    setLogTableLoading: (state, action) => { state.logTableLoading = action.payload; },
  },
});

const getLog = (state) => state.log.log;
const getLogs = (state) => state.log.logs;
const getLogsPagination = (state) => state.log.logsPagination;
const getLogDetailVisible = (state) => state.log.logDetailVisible;
const getLogTableLoading = (state) => state.log.logTableLoading;

const { setLog } = logSlice.actions;
const { setLogs } = logSlice.actions;
const { setLogsPagination } = logSlice.actions;
const { setLogDetailVisible } = logSlice.actions;
const { setLogTableLoading } = logSlice.actions;

const store = {
  logSlice,
  getLog,
  getLogs,
  getLogsPagination,
  getLogDetailVisible,
  getLogTableLoading,
  setLog,
  setLogs,
  setLogsPagination,
  setLogDetailVisible,
  setLogTableLoading,
};

export default store;
