import http from './http'

export default {
  getList() {
    return http.get('/api/services').then(r => r.data)
  },
  getById(id) {
    return http.get(`/api/services/${id}`).then(r => r.data)
  },
}
