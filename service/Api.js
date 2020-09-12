import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://localhost:8091',
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Request-Source': 'User-Interface'
    }
  })
}
