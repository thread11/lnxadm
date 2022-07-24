import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menu: {},
  menus: [],
  menuDetailVisible: false,
  menuFormAddVisible: false,
  menuFormCopyVisible: false,
  menuFormUpdateVisible: false,
  menuTableLoading: false,
  parentMenus: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action) => { state.menu = action.payload; },
    setMenus: (state, action) => { state.menus = action.payload; },
    setMenuDetailVisible: (state, action) => { state.menuDetailVisible = action.payload; },
    setMenuFormAddVisible: (state, action) => { state.menuFormAddVisible = action.payload; },
    setMenuFormCopyVisible: (state, action) => { state.menuFormCopyVisible = action.payload; },
    setMenuFormUpdateVisible: (state, action) => { state.menuFormUpdateVisible = action.payload; },
    setMenuTableLoading: (state, action) => { state.menuTableLoading = action.payload; },
    setParentMenus: (state, action) => { state.parentMenus = action.payload; },
  },
});

const getMenu = (state) => state.menu.menu;
const getMenus = (state) => state.menu.menus;
const getMenuDetailVisible = (state) => state.menu.menuDetailVisible;
const getMenuFormAddVisible = (state) => state.menu.menuFormAddVisible;
const getMenuFormCopyVisible = (state) => state.menu.menuFormCopyVisible;
const getMenuFormUpdateVisible = (state) => state.menu.menuFormUpdateVisible;
const getMenuTableLoading = (state) => state.menu.menuTableLoading;
const getParentMenus = (state) => state.menu.parentMenus;

const { setMenu } = menuSlice.actions;
const { setMenus } = menuSlice.actions;
const { setMenuDetailVisible } = menuSlice.actions;
const { setMenuFormAddVisible } = menuSlice.actions;
const { setMenuFormCopyVisible } = menuSlice.actions;
const { setMenuFormUpdateVisible } = menuSlice.actions;
const { setMenuTableLoading } = menuSlice.actions;
const { setParentMenus } = menuSlice.actions;

const store = {
  menuSlice,
  getMenu,
  getMenus,
  getMenuDetailVisible,
  getMenuFormAddVisible,
  getMenuFormCopyVisible,
  getMenuFormUpdateVisible,
  getMenuTableLoading,
  getParentMenus,
  setMenu,
  setMenus,
  setMenuDetailVisible,
  setMenuFormAddVisible,
  setMenuFormCopyVisible,
  setMenuFormUpdateVisible,
  setMenuTableLoading,
  setParentMenus,
};

export default store;
