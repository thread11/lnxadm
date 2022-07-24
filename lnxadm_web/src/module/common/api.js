import http from '../../util/http.js';

function changePassword(passwords) {
  let { old_password, new_password } = passwords;

  let formData = new FormData();
  formData.append('old_password', old_password);
  formData.append('new_password', new_password);
  return http.post('/api/common/change_password', formData);
}

function getCurrentUser() {
  return http.post('/api/common/get_current_user');
}

function login(user) {
  let { username, password } = user;

  let formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  return http.post('/api/common/login', formData);
}

function logout() {
  return http.get('/api/common/logout');
}

function updateProfile(profile) {
  let { nickname, email } = profile;

  let formData = new FormData();
  formData.append('nickname', nickname);
  formData.append('email', email);
  return http.post('/api/common/update_profile', formData);
}

const api = {
  changePassword,
  getCurrentUser,
  login,
  logout,
  updateProfile,
};

export default api;
