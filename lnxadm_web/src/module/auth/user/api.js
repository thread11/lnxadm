import http from '../../../util/http.js';

function addUser(user) {
  let { username, password, nickname, email, phone, is_admin, remark, dept_id } = user;

  let formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('nickname', nickname);
  if (email !== undefined && email !== null) {
    formData.append('email', email);
  }
  if (phone !== undefined && phone !== null) {
    formData.append('phone', phone);
  }
  formData.append('is_admin', is_admin);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }
  if (dept_id !== undefined && dept_id !== null) {
    formData.append('dept_id', dept_id);
  }

  return http.post('/api/auth/user/add_user', formData);
}

function assignRole(user_id, role_ids) {
  let formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('role_ids', role_ids);
  return http.post('/api/auth/user/assign_role', formData);
}

function deleteUser(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/user/delete_user', formData);
}

function disableUser(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/user/disable_user', formData);
}

function enableUser(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/user/enable_user', formData);
}

function getDepts() {
  return http.get('/api/auth/user/get_depts');
}

function getPerms(user_id) {
  return http.get('/api/auth/user/get_perms?user_id=' + user_id);
}

function getRoles(user_id) {
  return http.get('/api/auth/user/get_roles?id=' + user_id);
}

function getUser(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/user/get_user', formData);
}

function getUsers() {
  return http.get('/api/auth/user/get_users');
}

function grantPerm(user_id, perm_ids) {
  let formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('perm_ids', perm_ids);
  return http.post('/api/auth/user/grant_perm', formData);
}

function resetPassword(user) {
  let { id, password } = user;

  let formData = new FormData();
  formData.append('id', id);
  formData.append('password', password);

  return http.post('/api/auth/user/reset_password', formData);
}

function updateUser(user) {
  let { id, username, password, nickname, email, phone, is_admin, remark, dept_id } = user;

  let formData = new FormData();
  formData.append('id', id);
  formData.append('username', username);
  formData.append('password', password);
  formData.append('nickname', nickname);
  if (email !== undefined && email !== null) {
    formData.append('email', email);
  }
  if (phone !== undefined && phone !== null) {
    formData.append('phone', phone);
  }
  formData.append('is_admin', is_admin);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }
  if (dept_id !== undefined && dept_id !== null) {
    formData.append('dept_id', dept_id);
  }

  return http.post('/api/auth/user/update_user', formData);
}

const api = {
  addUser,
  assignRole,
  deleteUser,
  disableUser,
  enableUser,
  getDepts,
  getPerms,
  getRoles,
  getUser,
  getUsers,
  grantPerm,
  resetPassword,
  updateUser,
};

export default api;
