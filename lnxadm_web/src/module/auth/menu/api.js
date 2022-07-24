import http from '../../../util/http.js';

function addMenu(menu) {
  let { code, name, is_virtual, remark, parent_menu_id } = menu;

  let formData = new FormData();
  formData.append('code', code);
  formData.append('name', name);
  formData.append('is_virtual', is_virtual);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }
  if (parent_menu_id !== undefined && parent_menu_id !== null) {
    formData.append('parent_menu_id', parent_menu_id);
  }

  return http.post('/api/auth/menu/add_menu', formData);
}

function deleteMenu(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/menu/delete_menu', formData);
}

function getMenu(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/menu/get_menu', formData);
}

function getMenus() {
  return http.get('/api/auth/menu/get_menus');
}

function getParentMenus() {
  return http.get('/api/auth/menu/get_parent_menus');
}

function sortMenu(id_sorts) {
  let formData = new FormData();
  formData.append('id_sorts', id_sorts);

  return http.post('/api/auth/menu/sort_menu', formData);
}

function updateMenu(menu) {
  let { id, code, name, is_virtual, remark, parent_menu_id } = menu;

  let formData = new FormData();
  formData.append('id', id);
  formData.append('code', code);
  formData.append('name', name);
  formData.append('is_virtual', is_virtual);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }
  if (parent_menu_id !== undefined && parent_menu_id !== null) {
    formData.append('parent_menu_id', parent_menu_id);
  }

  return http.post('/api/auth/menu/update_menu', formData);
}

const api = {
  addMenu,
  deleteMenu,
  getMenu,
  getMenus,
  getParentMenus,
  sortMenu,
  updateMenu,
};

export default api;
