import http from '../../../util/http.js';

function addRole(role) {
  let { name, remark } = role;

  let formData = new FormData();
  formData.append('name', name);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/role/add_role', formData);
}

function deleteRole(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/role/delete_role', formData);
}

function getPerms(role_id) {
  return http.get('/api/auth/role/get_perms?role_id=' + role_id);
}

function getRole(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/role/get_role', formData);
}

function getRoles() {
  return http.get('/api/auth/role/get_roles');
}

function grantPerm(role_id, perm_ids) {
  let formData = new FormData();
  formData.append('role_id', role_id);
  formData.append('perm_ids', perm_ids);
  return http.post('/api/auth/role/grant_perm', formData);
}

function updateRole(role) {
  let { id, name, remark } = role;

  let formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/role/update_role', formData);
}

const api = {
  addRole,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
  getPerms,
  grantPerm,
};

export default api;
