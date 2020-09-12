import Api from '~/service/Api'

export default {
  retrieveEvents(start, end) {
    return Api().get('/events')
  }
}
