import { configureStore } from '@reduxjs/toolkit';
import commonStore from '../module/common/store.js';
import deptStore from '../module/auth/dept/store.js';
import menuStore from '../module/auth/menu/store.js';
import permStore from '../module/auth/perm/store.js';
import roleStore from '../module/auth/role/store.js';
import userStore from '../module/auth/user/store.js';
import logStore from '../module/system/log/store.js';

const store = configureStore({
  reducer: {
    common: commonStore.commonSlice.reducer,

    dept: deptStore.deptSlice.reducer,
    user: userStore.userSlice.reducer,
    role: roleStore.roleSlice.reducer,
    perm: permStore.permSlice.reducer,
    menu: menuStore.menuSlice.reducer,

    log: logStore.logSlice.reducer,
  },
});

export default store;
