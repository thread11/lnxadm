import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dept: {},
  depts: [],
  deptDetailVisible: false,
  deptFormAddVisible: false,
  deptFormUpdateVisible: false,
  deptTableLoading: false,
};

const deptSlice = createSlice({
  name: 'dept',
  initialState,
  reducers: {
    setDept: (state, action) => { state.dept = action.payload; },
    setDepts: (state, action) => { state.depts = action.payload; },
    setDeptDetailVisible: (state, action) => { state.deptDetailVisible = action.payload; },
    setDeptFormAddVisible: (state, action) => { state.deptFormAddVisible = action.payload; },
    setDeptFormUpdateVisible: (state, action) => { state.deptFormUpdateVisible = action.payload; },
    setDeptTableLoading: (state, action) => { state.deptTableLoading = action.payload; },
  },
});

const getDept = (state) => state.dept.dept;
const getDepts = (state) => state.dept.depts;
const getDeptDetailVisible = (state) => state.dept.deptDetailVisible;
const getDeptFormAddVisible = (state) => state.dept.deptFormAddVisible;
const getDeptFormUpdateVisible = (state) => state.dept.deptFormUpdateVisible;
const getDeptTableLoading = (state) => state.dept.deptTableLoading;

const { setDept } = deptSlice.actions;
const { setDepts } = deptSlice.actions;
const { setDeptDetailVisible } = deptSlice.actions;
const { setDeptFormAddVisible } = deptSlice.actions;
const { setDeptFormUpdateVisible } = deptSlice.actions;
const { setDeptTableLoading } = deptSlice.actions;

const store = {
  deptSlice,
  getDept,
  getDepts,
  getDeptDetailVisible,
  getDeptFormAddVisible,
  getDeptFormUpdateVisible,
  getDeptTableLoading,
  setDept,
  setDepts,
  setDeptDetailVisible,
  setDeptFormAddVisible,
  setDeptFormUpdateVisible,
  setDeptTableLoading,
};

export default store;
