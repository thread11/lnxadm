import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  context: {},
  perm: {},
  perms: [],
  permDetailVisible: false,
  permFormAddVisible: false,
  permFormCopyVisible: false,
  permFormUpdateVisible: false,
  permTableLoading: false,
  menus: [],
};

const permSlice = createSlice({
  name: 'perm',
  initialState,
  reducers: {
    setContext: (state, action) => { state.context = action.payload; },
    setPerm: (state, action) => { state.perm = action.payload; },
    setPerms: (state, action) => { state.perms = action.payload; },
    setPermDetailVisible: (state, action) => { state.permDetailVisible = action.payload; },
    setPermFormAddVisible: (state, action) => { state.permFormAddVisible = action.payload; },
    setPermFormCopyVisible: (state, action) => { state.permFormCopyVisible = action.payload; },
    setPermFormUpdateVisible: (state, action) => { state.permFormUpdateVisible = action.payload; },
    setPermTableLoading: (state, action) => { state.permTableLoading = action.payload; },
    setMenus: (state, action) => { state.menus = action.payload; },
  },
});

const getContext = (state) => state.perm.context;
const getPerm = (state) => state.perm.perm;
const getPerms = (state) => state.perm.perms;
const getPermDetailVisible = (state) => state.perm.permDetailVisible;
const getPermFormAddVisible = (state) => state.perm.permFormAddVisible;
const getPermFormCopyVisible = (state) => state.perm.permFormCopyVisible;
const getPermFormUpdateVisible = (state) => state.perm.permFormUpdateVisible;
const getPermTableLoading = (state) => state.perm.permTableLoading;
const getMenus = (state) => state.perm.menus;

const { setContext } = permSlice.actions;
const { setPerm } = permSlice.actions;
const { setPerms } = permSlice.actions;
const { setPermDetailVisible } = permSlice.actions;
const { setPermFormAddVisible } = permSlice.actions;
const { setPermFormCopyVisible } = permSlice.actions;
const { setPermFormUpdateVisible } = permSlice.actions;
const { setPermTableLoading } = permSlice.actions;
const { setMenus } = permSlice.actions;

const store = {
  permSlice,
  getContext,
  getPerm,
  getPerms,
  getPermDetailVisible,
  getPermFormAddVisible,
  getPermFormCopyVisible,
  getPermFormUpdateVisible,
  getPermTableLoading,
  getMenus,
  setContext,
  setPerm,
  setPerms,
  setPermDetailVisible,
  setPermFormAddVisible,
  setPermFormCopyVisible,
  setPermFormUpdateVisible,
  setPermTableLoading,
  setMenus,
};

export default store;
