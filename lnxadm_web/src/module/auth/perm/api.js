import http from '../../../util/http.js';
import store from '../../../global/store.js';

function addPerm(perm) {
  let { code, name, remark, menu_id } = perm;

  let formData = new FormData();
  formData.append('code', code);
  formData.append('name', name);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }
  if (menu_id !== undefined && menu_id !== null) {
    formData.append('menu_id', menu_id);
  }

  return http.post('/api/auth/perm/add_perm', formData);
}

function deletePerm(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/perm/delete_perm', formData);
}

function getMenus() {
  return http.get('/api/auth/perm/get_menus');
}

function getPerm(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/perm/get_perm', formData);
}

function getPerms() {
  const state = store.getState();
  const context = state.perm.context;

  let { menuId } = context;
  let menu_id = menuId;

  if (menuId !== undefined) {
    return http.get('/api/auth/perm/get_perms?menu_id=' + menu_id);
  } else {
    return http.get('/api/auth/perm/get_perms');
  }
}

function updatePerm(perm) {
  let { id, code, name, remark, menu_id } = perm;

  let formData = new FormData();
  formData.append('id', id);
  formData.append('code', code);
  formData.append('name', name);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }
  if (menu_id !== undefined && menu_id !== null) {
    formData.append('menu_id', menu_id);
  }

  return http.post('/api/auth/perm/update_perm', formData);
}

const api = {
  addPerm,
  deletePerm,
  getMenus,
  getPerm,
  getPerms,
  updatePerm,
};

export default api;
