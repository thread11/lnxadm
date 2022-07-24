import http from '../../../util/http.js';
import store from '../../../global/store.js';

function getLog(id) {
  let formData = new FormData();
  formData.append('id', id);
  return http.post('/api/system/log/get_log', formData);
}

function getLogs() {
  const state = store.getState();
  const logsPagination = state.log.logsPagination;

  let { page, size } = logsPagination;

  let api = '/api/system/log/get_logs';
  if (page !== undefined && size !== undefined) {
    api += '?page=' + page + '&size=' + size;
  }
  return http.get(api);
}

const api = {
  getLog,
  getLogs,
};

export default api;
