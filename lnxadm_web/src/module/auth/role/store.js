import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: {},
  roles: [],
  roleDetailVisible: false,
  roleFormAddVisible: false,
  roleFormUpdateVisible: false,
  roleTableLoading: false,
  perms: [],
  permsExtra: {},
  permListVisible: false,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action) => { state.role = action.payload; },
    setRoles: (state, action) => { state.roles = action.payload; },
    setRoleDetailVisible: (state, action) => { state.roleDetailVisible = action.payload; },
    setRoleFormAddVisible: (state, action) => { state.roleFormAddVisible = action.payload; },
    setRoleFormUpdateVisible: (state, action) => { state.roleFormUpdateVisible = action.payload; },
    setRoleTableLoading: (state, action) => { state.roleTableLoading = action.payload; },
    setPerms: (state, action) => { state.perms = action.payload; },
    setPermsExtra: (state, action) => { state.permsExtra = action.payload; },
    setPermListVisible: (state, action) => { state.permListVisible = action.payload; },
  },
});

const getRole = (state) => state.role.role;
const getRoles = (state) => state.role.roles;
const getRoleDetailVisible = (state) => state.role.roleDetailVisible;
const getRoleFormAddVisible = (state) => state.role.roleFormAddVisible;
const getRoleFormUpdateVisible = (state) => state.role.roleFormUpdateVisible;
const getRoleTableLoading = (state) => state.role.roleTableLoading;
const getPerms = (state) => state.role.perms;
const getPermsExtra = (state) => state.role.permsExtra;
const getPermListVisible = (state) => state.role.permListVisible;

const { setRole } = roleSlice.actions;
const { setRoles } = roleSlice.actions;
const { setRoleDetailVisible } = roleSlice.actions;
const { setRoleFormAddVisible } = roleSlice.actions;
const { setRoleFormUpdateVisible } = roleSlice.actions;
const { setRoleTableLoading } = roleSlice.actions;
const { setPerms } = roleSlice.actions;
const { setPermsExtra } = roleSlice.actions;
const { setPermListVisible } = roleSlice.actions;

const store = {
  roleSlice,
  getRole,
  getRoles,
  getRoleDetailVisible,
  getRoleFormAddVisible,
  getRoleFormUpdateVisible,
  getRoleTableLoading,
  getPerms,
  getPermsExtra,
  getPermListVisible,
  setRole,
  setRoles,
  setRoleDetailVisible,
  setRoleFormAddVisible,
  setRoleFormUpdateVisible,
  setRoleTableLoading,
  setPerms,
  setPermsExtra,
  setPermListVisible,
};

export default store;
