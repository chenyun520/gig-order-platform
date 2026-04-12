import http from './http'

export default {
  getList() {
    return http.get('/api/notifications').then(r => r.data)
  },
}
