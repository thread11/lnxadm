import http from '../../../util/http.js';

function addDept(dept) {
  let { name, remark } = dept;

  let formData = new FormData();
  formData.append('name', name);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/dept/add_dept', formData);
}

function deleteDept(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/dept/delete_dept', formData);
}

function getDept(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/auth/dept/get_dept', formData);
}

function getDepts() {
  return http.get('/api/auth/dept/get_depts');
}

function updateDept(dept) {
  let { id, name, remark } = dept;

  let formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  if (remark !== undefined && remark !== null) {
    formData.append('remark', remark);
  }

  return http.post('/api/auth/dept/update_dept', formData);
}

const api = {
  addDept,
  deleteDept,
  getDept,
  getDepts,
  updateDept,
};

export default api;
