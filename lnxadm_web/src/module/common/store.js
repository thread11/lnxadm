import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  siderCollapsed: localStorage.getItem('siderCollapsed') === 'true',
  currentUser: {},
  userFormPasswordVisible: false,
  userFormProfileVisible: false,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setSiderCollapsed: (state, action) => { state.siderCollapsed = action.payload; },
    setCurrentUser: (state, action) => { state.currentUser = action.payload; },
    setUserFormPasswordVisible: (state, action) => { state.userFormPasswordVisible = action.payload; },
    setUserFormProfileVisible: (state, action) => { state.userFormProfileVisible = action.payload; },
  },
});

const getSiderCollapsed = (state) => state.common.siderCollapsed;
const getCurrentUser = (state) => state.common.currentUser;
const getUserFormPasswordVisible = (state) => state.common.userFormPasswordVisible;
const getUserFormProfileVisible = (state) => state.common.userFormProfileVisible;

const { setSiderCollapsed } = commonSlice.actions;
const { setCurrentUser } = commonSlice.actions;
const { setUserFormPasswordVisible } = commonSlice.actions;
const { setUserFormProfileVisible } = commonSlice.actions;

const store = {
  commonSlice,
  getSiderCollapsed,
  getCurrentUser,
  getUserFormPasswordVisible,
  getUserFormProfileVisible,
  setSiderCollapsed,
  setCurrentUser,
  setUserFormPasswordVisible,
  setUserFormProfileVisible,
};

export default store;
