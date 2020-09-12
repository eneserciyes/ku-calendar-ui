import Api from '~/service/Api'

export default {
  retrieveEvents() {
    return Api().get('/persistence/events')
  }
}
